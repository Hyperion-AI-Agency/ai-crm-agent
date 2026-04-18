import buttons from "@/payload/components/buttons";
import image from "@/payload/components/image";
import positionSelector from "@/payload/components/positionSelector";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";

const ContentWithMedia: Block = {
  slug: "cwm",
  labels: {
    singular: { lt: "Turinys su medija", en: "Content With Media" },
    plural: { lt: "Turinio su medija blokai", en: "Content With Media Blocks" },
  },
  fields: [
    {
      name: "active",
      label: { lt: "Aktyvuoti bloką", en: "Activate Block" },
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "headerSection",
      type: "group",
      label: { lt: "Antraštės sekcija", en: "Header Section" },
      fields: [
        {
          name: "headerText",
          label: { lt: "Antraštės tekstas", en: "Header Text" },
          type: "text",
        },
        {
          name: "headerLevel",
          label: { lt: "Antraštės lygis", en: "Header Level" },
          type: "select",
          options: ["h2", "h3", "h4", "h5", "h6"],
          defaultValue: "h2",
          admin: {
            isClearable: false,
          },
        },
        {
          name: "anchor",
          label: { lt: "Žymė", en: "Anchor" },
          type: "text",
        },
      ],
      interfaceName: "HeaderSectionProps",
    },
    image(),
    {
      name: "imageOrientation",
      label: { lt: "Vaizdo orientacija", en: "Image Orientation" },
      type: "select",
      options: [
        { label: { lt: "Gulsčias", en: "Landscape" }, value: "landscape" },
        { label: { lt: "Kvadratinis", en: "Square" }, value: "square" },
      ],
    },
    {
      name: "content",
      label: { lt: "Turinys", en: "Content" },
      type: "richText",
      editor: lexicalEditor({}),
    },
    buttons(),
    positionSelector(),
  ],
  interfaceName: "ContentWithMediaProps",
};

export default ContentWithMedia;
