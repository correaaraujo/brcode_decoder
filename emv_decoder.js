"use strict";

const express = require("express");
const app = express();

app.use(express.static("public"));

app.post("/decode/:emv", function (req, res) {
  console.log(req.params.emv);

  if (req.params.emv == null)
    res.send("Desculpe, você precisa passar os dados emv");

  let result = new Array();

  let emv = req.params.emv;
  let length = 0;
  let index = 0;
  while (length < emv.length) {
    let field = emv.substr(index, 4);
    let fieldId = field.substr(0, 2);
    let size = field.substr(2, 2);
    index += field.length + parseInt(size);

    let fieldValue = emv.substr(index - size, size);
    console.log("\x1b[33m%s\x1b[0m", `${field} ${fieldValue}`);
    result.push(`${field} ${fieldValue}`);
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
        result.push(
          `${sub_field} ${fieldValue.substr(sub_index - sub_size, sub_size)}`
        );
        sub_length = sub_index;
      }
    }
  }
  res.send(JSON.stringify(result));
});

app.listen(process.env.PORT || 3000, () => console.log("Server is running..."));
