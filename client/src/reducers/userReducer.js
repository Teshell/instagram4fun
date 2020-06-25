export const initialState = null;

export const userReducer = (state, action) => {
  if (action.type === "USER") {
    return action.payload;
  }

  if (action.type === "CLEAR") {
    return null;
  }

  if (action.type === "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      following: action.payload.following,
    };
  }

  if (action.type === "UPDATEPIC") {
    return {
      ...state,
      profilePic: action.payload,
    };
  }

  if (action.type === "UPDATE_INFO") {
    return {
      ...state,
      name: action.payload,
    };
  }

  return state;
};
