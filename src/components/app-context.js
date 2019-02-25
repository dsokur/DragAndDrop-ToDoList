import React from 'react';

// Context provides a way to pass data through the component
// tree without having to pass props down manually at every level.

// Here we path our state and function to all components.
// With this approach we don't have to path props top-down (parent to child) via props.
// Context provides a way to share values between components without having to explicitly pass a prop through every level of the tree.
// Context only share some values through our app it doesn't store it. All the data store in component that declares it,
// in our case App component
export default React.createContext({
  handleEditTask: () => {},
  deleteTask: () => {},
  changeLists: () => {},
});