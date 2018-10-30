const rules = [
  {
    tag: {
      include: "img"
    },
    attribute: {
      without: {
        alt: undefined
      }
    }
  },

  {
    tag: {
      include: "a"
    },
    attribute: {
      without: {
        rel: undefined
      }
    }
  },

  {
    parent_node: "head",
    tag: {
      include: "title"
    },
    condition: {
      "=": 1
    }
  },

  {
    parent_node: "head",
    tag: {
      include: "meta"
    },
    attribute: {
      with: {
        name: "description"
      }
    }
  },

  {
    parent_node: "head",
    tag: {
      include: "meta"
    },
    attribute: {
      with: {
        name: "keywords"
      }
    }
  },

  {
    tag: {
      include: "strong"
    },
    condition: {
      "<": 15
    }
  },

  {
    tag: {
      include: "h1"
    },
    condition: {
      ">": 1
    }
  }
];

module.exports = rules;
