const alertError = (error) =>
  error && error.constructor.name === 'Object'
    ? alert(
        Object.keys(error)
          .map((field) => `${field}: ${error[field]}`)
          .join('\n')
      )
    : null;

export default alertError;
