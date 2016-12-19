import ProtoBuf from 'protobufjs';
import protobufToJson from 'protobufjs/cli/targets/json';
import { createFilter } from 'rollup-pluginutils';


const ext = /\.proto$/;

export default function protobuf(options = {}) {
    const filter = createFilter(options.include, options.exclude);

    return {
        name: 'protobuf',

        transform(code, id) {
            if (!ext.test(id)) return null;
            if (!filter(id)) return null;

            const root = new ProtoBuf.Root();
			root.loadSync(id);
            const json = JSON.stringify(root);

            return {
                code: `import ProtoBuf from 'protobufjs';\nexport default ProtoBuf.Root.fromJSON(${json});`,
                map: { mappings: '' }
            };
        }
    };
}
