import ProtoBuf from 'protobufjs';
import protobufToJson from 'protobufjs/cli/targets/json';
import protobufToStatic from 'protobufjs/cli/targets/static';
import { createFilter } from 'rollup-pluginutils';


const ext = /\.proto$/;

export default function protobuf(options = {}) {
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'protobuf',

        transform(code, id) {
            if (!ext.test(id)) return null;
            if (!filter(id)) return null;
			
			return new Promise((resolve, reject) => {
				new ProtoBuf.Root().load(id, options, (err, root) => {
					if(err) return reject(err);
					if(options.target == 'static') {
						protobufToStatic(root, options, (err, code) => {
							if(err) return reject(err);
							resolve({
								code: `import $protobuf from 'protobufjs/runtime';\n${code}\nexport default $root;`,
								map: { mappings: '' }
							});
						});
					} else {
						protobufToJson(root, options, (err, code) => {
							if(err) return reject(err);
							resolve({
								code: `import ProtoBuf from 'protobufjs';\nexport default ProtoBuf.Root.fromJSON(${json});`,
								map: { mappings: '' }
							});
						});
					}
				});
			});
        }
    };
}
