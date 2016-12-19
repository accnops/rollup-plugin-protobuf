import ProtoBuf from 'protobufjs';
import protobufToJson from 'protobufjs/cli/targets/json';
import protobufToStatic from 'protobufjs/cli/targets/static';
import { createFilter } from 'rollup-pluginutils';

var ext = /\.proto$/;

function protobuf(options) {
    if ( options === void 0 ) options = {};

    var filter = createFilter(options.include, options.exclude);

    return {
        name: 'protobuf',

        transform: function transform(code, id) {
            if (!ext.test(id)) return null;
            if (!filter(id)) return null;
			
			return new Promise(function (resolve, reject) {
				new ProtoBuf.Root().load(id, options, function (err, root) {
					if(err) return reject(err);
					if(options.target == 'static') {
						protobufToStatic(root, options, function (err, code) {
							if(err) return reject(err);
							resolve({
								code: ("import $protobuf from 'protobufjs/runtime';\n" + code + "\nexport default $root;"),
								map: { mappings: '' }
							});
						});
					} else {
						protobufToJson(root, options, function (err, code) {
							if(err) return reject(err);
							resolve({
								code: ("import ProtoBuf from 'protobufjs';\nexport default ProtoBuf.Root.fromJSON(" + json + ");"),
								map: { mappings: '' }
							});
						});
					}
				});
			});
        }
    };
}

export default protobuf;