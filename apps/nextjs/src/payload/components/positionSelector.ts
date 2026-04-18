import deepMerge from "@/payload/utilities/deepMerge";
import { Field } from "payload";

type PositionSelector = (fieldToUse?: string, overrides?: Partial<Field>) => Field;
const positionSelector: PositionSelector = (fieldToUse = "name", overrides) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: "textPosition",
      label: { lt: "Teksto pozicija", en: "Text Position" },
      type: "radio",
      options: [
        { label: { lt: "Kairė", en: "Left" }, value: "Left" },
        { label: { lt: "Dešinė", en: "Right" }, value: "Right" },
        { label: { lt: "Priekyje", en: "Foreground" }, value: "Foreground" },
      ],
      admin: {
        description:
          "Which side of the screen should the text show up on on bigger screens? Or do you want the image to be in the background",
      },
    },
    overrides
  );

export default positionSelector;
