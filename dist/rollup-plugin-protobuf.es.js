import ProtoBuf from 'protobufjs';
import 'protobufjs/cli/targets/json';
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

            var root = new ProtoBuf.Root();
			root.loadSync(id);
            var json = JSON.stringify(root);

            return {
                code: ("import ProtoBuf from 'protobufjs';\nexport default ProtoBuf.Root.fromJson(" + json + ");"),
                map: { mappings: '' }
            };
        }
    };
}

export default protobuf;