import crypto from "node:crypto";

const alphabet =
  "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";

export const nanoid = (size = 8) => {
  let id = "";
  const bytes = crypto.randomBytes(size);

  while (0 < size--) {
    id += alphabet[bytes[size] & 63];
  }

  return id;
};
