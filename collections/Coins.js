// Example Collection - For reference only, this must be added to payload.config.js to be used.
const Coins = {
  slug: "coins",
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "code",
      type: "text",
      required: true,
    },
    {
      name: "payment",
      type: "text",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: 'typeCoin',
      type: 'select',
      options: [
        {
          label: 'STABLE',
          value: 'STABLE'
        },
        {
          label: 'CRYPTO',
          value: 'CRYPTO'
        }
      ]
    },
    {
      name: "coins",
      type: "array",
      required: true,
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "code",
          type: "text",
          required: true,
        },
        {
          name: 'typeCoin',
          type: 'select',
          options: [
            {
              label: 'STABLE',
              value: 'STABLE'
            },
            {
              label: 'CRYPTO',
              value: 'CRYPTO'
            }
          ]
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },

      ],
    },
  ],
};

export default Coins;
