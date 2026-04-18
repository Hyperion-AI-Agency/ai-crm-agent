import deepMerge from "@/payload/utilities/deepMerge";
import { Field } from "payload";

type Image = (fieldToUse?: string, overrides?: Partial<Field>) => Field;
const image: Image = (fieldToUse = "name", overrides) =>
  deepMerge<Field, Partial<Field>>(
    {
      type: "group",
      name: "image",
      label: { lt: "Paveikslėlis", en: "Image" },
      fields: [
        {
          name: "image",
          label: { lt: "Paveikslėlis", en: "Image" },
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Recommended size is 640x360 (16:9 aspect ratio)",
          },
        },
        {
          name: "imagePosition",
          label: { lt: "Vaizdo pozicija", en: "Image Position" },
          type: "select",
          options: [
            { label: { lt: "Viršus", en: "Top" }, value: "backgroundTop" },
            { label: { lt: "Apačia", en: "Bottom" }, value: "backgroundBottom" },
            { label: { lt: "Centras", en: "Center" }, value: "backgroundCenter" },
            { label: { lt: "Kairė", en: "Left" }, value: "backgroundLeft" },
            { label: { lt: "Dešinė", en: "Right" }, value: "backgroundRight" },
          ],
          defaultValue: "backgroundCenter",
          admin: {
            description:
              "Choose how you want to align the background image in the hero section. This does not change the placement of the image in the flow of the page.",
          },
        },
      ],
    },
    overrides
  );

export default image;
