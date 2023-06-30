import React from "react";
import Context from "./Context";

// a component wrapper, which we’ll use to wrap components that use the context data and methods
// HOC - Higher Order Component, appends context to a wrapped component’s props
const withContext = WrappedComponent => {
  const WithHOC = props => {
    return (
      <Context.Consumer>
        {context => <WrappedComponent {...props} context={context} />}
      </Context.Consumer>
    );
  };

  return WithHOC;
};

export default withContext;