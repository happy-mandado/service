
const serializeUser = (user) => ({
  email: user.email,
  id: user.sub,
  surname: user.family_name,
  name: user.given_name,
  locale: user.locale,
  fullName: user.name,
  handler: user.nickname,
  picture: user.picture,
});

const serializeProduct = (product) => ({
});

const serializeList = (list) => ({
  id: list.id,
  name: list.name,
  products: products,
  createdAt: list.createdAt,
  closedAt: list.closedAt,
});

const serializeDraft = (draft) => ({
  id: draft.id,
  name: draft.name,
  createdAt: draft.createdAt,
  closedAt: draft.closedAt,
});

const serializeSuggestion = (suggestion) => ({
});

module.exports = {
  serializeUser,
  serializeProduct,
  serializeList,
  serializeDraft,
  serializeSuggestion,
};
