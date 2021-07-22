"use strict";

console.log(process.argv.slice(2));
let emv = process.argv.slice(2).toString();
let length = 0;
let index = 0;
while (length < emv.length) {
  let field = emv.substr(index, 4);
  let fieldId = field.substr(0, 2);
  let size = field.substr(2, 2);
  index += field.length + parseInt(size);

  let fieldValue = emv.substr(index - size, size);
  console.log("\x1b[33m%s\x1b[0m", `${field} ${fieldValue}`);
  length = index;

  if (fieldId == 26 || fieldId == 62 || fieldId == 80) {
    let sub_length = 0;
    let sub_index = 0;
    while (sub_length < parseInt(size)) {
      let sub_field = fieldValue.substr(sub_index, 4);
      let sub_fieldId = sub_field.substr(0, 2);
      let sub_size = sub_field.substr(2, 2);

      sub_index += sub_field.length + parseInt(sub_size);

      console.log(
        "\x1b[36m%s\x1b[0m",
        ` ${sub_field} ${fieldValue.substr(sub_index - sub_size, sub_size)}`
      );
      sub_length = sub_index;
    }
  }
}
