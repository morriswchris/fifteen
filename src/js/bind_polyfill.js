Function.prototype.bind = Function.prototype.bind || function(target) {
  const self = this;
  return args => {
    if (!(args instanceof Array)) {
      args = [args];
    }
    self.apply(target, args);
  };
};
