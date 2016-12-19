import ProtoBuf from 'protobufjs';
import protobufToJson from 'protobufjs/cli/targets/json';
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

            var parser = new ProtoBuf.DotProto.Parser(code);
            var data = parser.parse();

            var builder = ProtoBuf.newBuilder(options);
            builder["import"](data);

            var json = protobufToJson(builder, options);

            return {
                code: ("import ProtoBuf from 'protobufjs/dist/runtime/protobuf';\nexport default ProtoBuf.loadJson(" + json + ").build();"),
                map: { mappings: '' }
            };
        }
    };
}

export default protobuf;