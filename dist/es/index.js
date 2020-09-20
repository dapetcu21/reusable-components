import React, { useContext, forwardRef, useMemo, createContext, useState, useEffect, useCallback, useLayoutEffect, useRef, memo } from 'react';
import { lightFormat, parseISO } from 'date-fns';
import Select from 'react-select';

function mergeClasses(a, b) {
  if (!a) {
    return b || undefined;
  }

  if (!b) {
    return a || undefined;
  }

  return "".concat(a, " ").concat(b);
}
function overrideClasses(classes, overrides) {
  if (!overrides) {
    return classes;
  }

  var newClasses = Object.assign({}, classes);

  for (var key in overrides) {
    var mergedClasses = mergeClasses(newClasses[key], overrides[key]);

    if (mergedClasses) {
      newClasses[key] = mergedClasses;
    }
  }

  return newClasses;
}
var defaultTheme = {
  colors: {
    primary: "#FFCC00",
    primary75: "#FFCC00AF",
    primary50: "#FFCC007F",
    primary25: "#FFCC003F",
    secondary: "#352245"
  },
  componentClasses: {},
  componentValues: {}
};
var ThemeContext = /*#__PURE__*/createContext(defaultTheme);
function useTheme() {
  return useContext(ThemeContext);
}
var ThemeProvider = ThemeContext.Provider;
function mergeThemeClasses(theme, componentName, componentClasses, propsClasses, propsClassName) {
  var classes = overrideClasses(componentClasses || {}, theme.componentClasses[componentName]);
  classes = overrideClasses(classes, propsClasses);

  if (propsClassName) {
    classes = overrideClasses(classes, {
      root: propsClassName
    });
  }

  return classes;
}

var mergeConstants = (a, b) => {
  if (!a) {
    return b;
  }

  if (!b) {
    return a;
  }

  return Object.assign({}, a, b);
};

var emptyValues = {};
function mergeThemeConstants(theme, componentName, componentValues, propsValues) {
  var values = mergeConstants(componentValues, theme.componentValues[componentName]);
  values = mergeConstants(values, propsValues) || emptyValues;
  return values;
} // This function has this arity so that it can also be used as a decorator,
// whenever those might become mainstream

var themable = (componentName, componentClasses, componentValues) => {
  return Component => {
    return /*#__PURE__*/forwardRef(function WrappedComponent(props, ref) {
      var theme = useTheme();
      var classes = useMemo(() => mergeThemeClasses(theme, componentName, componentClasses, props.classes, props.className), [theme, props.classes, props.className]);
      var constants = useMemo(() => mergeThemeConstants(theme, componentName, componentValues, props.constants), [theme, props.constants]);
      return /*#__PURE__*/React.createElement(Component, Object.assign({}, props, {
        classes: classes,
        constants: constants,
        ref: ref
      }));
    });
  };
};

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var Op = Object.prototype;
var hasOwn = Op.hasOwnProperty;
var undefined$1; // More compressible than void 0.

var $Symbol = typeof Symbol === "function" ? Symbol : {};
var iteratorSymbol = $Symbol.iterator || "@@iterator";
var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

function wrap(innerFn, outerFn, self, tryLocsList) {
  // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
  var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
  var generator = Object.create(protoGenerator.prototype);
  var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
  // .throw, and .return methods.

  generator._invoke = makeInvokeMethod(innerFn, self, context);
  return generator;
} // Try/catch helper to minimize deoptimizations. Returns a completion
// record like context.tryEntries[i].completion. This interface could
// have been (and was previously) designed to take a closure to be
// invoked without arguments, but in all the cases we care about we
// already have an existing method we want to call, so there's no need
// to create a new function object. We can even get away with assuming
// the method takes exactly one argument, since that happens to be true
// in every case, so we don't have to touch the arguments object. The
// only additional allocation required is the completion record, which
// has a stable shape and so hopefully should be cheap to allocate.


function tryCatch(fn, obj, arg) {
  try {
    return {
      type: "normal",
      arg: fn.call(obj, arg)
    };
  } catch (err) {
    return {
      type: "throw",
      arg: err
    };
  }
}

var GenStateSuspendedStart = "suspendedStart";
var GenStateSuspendedYield = "suspendedYield";
var GenStateExecuting = "executing";
var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
// breaking out of the dispatch switch statement.

var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
// .constructor.prototype properties for functions that return Generator
// objects. For full spec compliance, you may wish to configure your
// minifier not to mangle the names of these two functions.

function Generator() {}

function GeneratorFunction() {}

function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
// don't natively support it.


var IteratorPrototype = {};

IteratorPrototype[iteratorSymbol] = function () {
  return this;
};

var getProto = Object.getPrototypeOf;
var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
  // This environment has a native %IteratorPrototype%; use it instead
  // of the polyfill.
  IteratorPrototype = NativeIteratorPrototype;
}

var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
GeneratorFunctionPrototype.constructor = GeneratorFunction;
GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
// Iterator interface in terms of a single ._invoke method.

function defineIteratorMethods(prototype) {
  ["next", "throw", "return"].forEach(function (method) {
    prototype[method] = function (arg) {
      return this._invoke(method, arg);
    };
  });
}

function isGeneratorFunction(genFun) {
  var ctor = typeof genFun === "function" && genFun.constructor;
  return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
  // do is to check its .name property.
  (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
}

function mark(genFun) {
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
  } else {
    genFun.__proto__ = GeneratorFunctionPrototype;

    if (!(toStringTagSymbol in genFun)) {
      genFun[toStringTagSymbol] = "GeneratorFunction";
    }
  }

  genFun.prototype = Object.create(Gp);
  return genFun;
}
// `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
// `hasOwn.call(value, "__await")` to determine if the yielded value is
// meant to be awaited.

function awrap(arg) {
  return {
    __await: arg
  };
}

function AsyncIterator(generator, PromiseImpl) {
  function invoke(method, arg, resolve, reject) {
    var record = tryCatch(generator[method], generator, arg);

    if (record.type === "throw") {
      reject(record.arg);
    } else {
      var result = record.arg;
      var value = result.value;

      if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
        return PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        });
      }

      return PromiseImpl.resolve(value).then(function (unwrapped) {
        // When a yielded Promise is resolved, its final value becomes
        // the .value of the Promise<{value,done}> result for the
        // current iteration.
        result.value = unwrapped;
        resolve(result);
      }, function (error) {
        // If a rejected Promise was yielded, throw the rejection back
        // into the async generator function so it can be handled there.
        return invoke("throw", error, resolve, reject);
      });
    }
  }

  var previousPromise;

  function enqueue(method, arg) {
    function callInvokeWithMethodAndArg() {
      return new PromiseImpl(function (resolve, reject) {
        invoke(method, arg, resolve, reject);
      });
    }

    return previousPromise = // If enqueue has been called before, then we want to wait until
    // all previous Promises have been resolved before calling invoke,
    // so that results are always delivered in the correct order. If
    // enqueue has not been called before, then it is important to
    // call invoke immediately, without waiting on a callback to fire,
    // so that the async generator function has the opportunity to do
    // any necessary setup in a predictable way. This predictability
    // is why the Promise constructor synchronously invokes its
    // executor callback, and why async functions synchronously
    // execute code before the first await. Since we implement simple
    // async functions in terms of async generators, it is especially
    // important to get this right, even though it requires care.
    previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
    // invocations of the iterator.
    callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
  } // Define the unified helper method that is used to implement .next,
  // .throw, and .return (see defineIteratorMethods).


  this._invoke = enqueue;
}

defineIteratorMethods(AsyncIterator.prototype);

AsyncIterator.prototype[asyncIteratorSymbol] = function () {
  return this;
}; // Note that simple async functions are implemented on top of
// AsyncIterator objects; they just return a Promise for the value of
// the final result produced by the iterator.


function async(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
  if (PromiseImpl === void 0) PromiseImpl = Promise;
  var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
  return isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
  : iter.next().then(function (result) {
    return result.done ? result.value : iter.next();
  });
}

function makeInvokeMethod(innerFn, self, context) {
  var state = GenStateSuspendedStart;
  return function invoke(method, arg) {
    if (state === GenStateExecuting) {
      throw new Error("Generator is already running");
    }

    if (state === GenStateCompleted) {
      if (method === "throw") {
        throw arg;
      } // Be forgiving, per 25.3.3.3.3 of the spec:
      // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


      return doneResult();
    }

    context.method = method;
    context.arg = arg;

    while (true) {
      var delegate = context.delegate;

      if (delegate) {
        var delegateResult = maybeInvokeDelegate(delegate, context);

        if (delegateResult) {
          if (delegateResult === ContinueSentinel) continue;
          return delegateResult;
        }
      }

      if (context.method === "next") {
        // Setting context._sent for legacy support of Babel's
        // function.sent implementation.
        context.sent = context._sent = context.arg;
      } else if (context.method === "throw") {
        if (state === GenStateSuspendedStart) {
          state = GenStateCompleted;
          throw context.arg;
        }

        context.dispatchException(context.arg);
      } else if (context.method === "return") {
        context.abrupt("return", context.arg);
      }

      state = GenStateExecuting;
      var record = tryCatch(innerFn, self, context);

      if (record.type === "normal") {
        // If an exception is thrown from innerFn, we leave state ===
        // GenStateExecuting and loop back for another invocation.
        state = context.done ? GenStateCompleted : GenStateSuspendedYield;

        if (record.arg === ContinueSentinel) {
          continue;
        }

        return {
          value: record.arg,
          done: context.done
        };
      } else if (record.type === "throw") {
        state = GenStateCompleted; // Dispatch the exception by looping back around to the
        // context.dispatchException(context.arg) call above.

        context.method = "throw";
        context.arg = record.arg;
      }
    }
  };
} // Call delegate.iterator[context.method](context.arg) and handle the
// result, either by returning a { value, done } result from the
// delegate iterator, or by modifying context.method and context.arg,
// setting context.delegate to null, and returning the ContinueSentinel.


function maybeInvokeDelegate(delegate, context) {
  var method = delegate.iterator[context.method];

  if (method === undefined$1) {
    // A .throw or .return when the delegate iterator has no .throw
    // method always terminates the yield* loop.
    context.delegate = null;

    if (context.method === "throw") {
      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined$1;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }

      context.method = "throw";
      context.arg = new TypeError("The iterator does not provide a 'throw' method");
    }

    return ContinueSentinel;
  }

  var record = tryCatch(method, delegate.iterator, context.arg);

  if (record.type === "throw") {
    context.method = "throw";
    context.arg = record.arg;
    context.delegate = null;
    return ContinueSentinel;
  }

  var info = record.arg;

  if (!info) {
    context.method = "throw";
    context.arg = new TypeError("iterator result is not an object");
    context.delegate = null;
    return ContinueSentinel;
  }

  if (info.done) {
    // Assign the result of the finished delegate to the temporary
    // variable specified by delegate.resultName (see delegateYield).
    context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

    context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
    // exception, let the outer generator proceed normally. If
    // context.method was "next", forget context.arg since it has been
    // "consumed" by the delegate iterator. If context.method was
    // "return", allow the original .return call to continue in the
    // outer generator.

    if (context.method !== "return") {
      context.method = "next";
      context.arg = undefined$1;
    }
  } else {
    // Re-yield the result returned by the delegate method.
    return info;
  } // The delegate iterator is finished, so forget it and continue with
  // the outer generator.


  context.delegate = null;
  return ContinueSentinel;
} // Define Generator.prototype.{next,throw,return} in terms of the
// unified ._invoke helper method.


defineIteratorMethods(Gp);
Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
// @@iterator function is called on it. Some browsers' implementations of the
// iterator prototype chain incorrectly implement this, causing the Generator
// object to not be returned from this call. This ensures that doesn't happen.
// See https://github.com/facebook/regenerator/issues/274 for more details.

Gp[iteratorSymbol] = function () {
  return this;
};

Gp.toString = function () {
  return "[object Generator]";
};

function pushTryEntry(locs) {
  var entry = {
    tryLoc: locs[0]
  };

  if (1 in locs) {
    entry.catchLoc = locs[1];
  }

  if (2 in locs) {
    entry.finallyLoc = locs[2];
    entry.afterLoc = locs[3];
  }

  this.tryEntries.push(entry);
}

function resetTryEntry(entry) {
  var record = entry.completion || {};
  record.type = "normal";
  delete record.arg;
  entry.completion = record;
}

function Context(tryLocsList) {
  // The root entry object (effectively a try statement without a catch
  // or a finally block) gives us a place to store values thrown from
  // locations where there is no enclosing try statement.
  this.tryEntries = [{
    tryLoc: "root"
  }];
  tryLocsList.forEach(pushTryEntry, this);
  this.reset(true);
}

function keys(object) {
  var keys = [];

  for (var key in object) {
    keys.push(key);
  }

  keys.reverse(); // Rather than returning an object with a next method, we keep
  // things simple and return the next function itself.

  return function next() {
    while (keys.length) {
      var key = keys.pop();

      if (key in object) {
        next.value = key;
        next.done = false;
        return next;
      }
    } // To avoid creating an additional object, we just hang the .value
    // and .done properties off the next function object itself. This
    // also ensures that the minifier will not anonymize the function.


    next.done = true;
    return next;
  };
}

function values(iterable) {
  if (iterable) {
    var iteratorMethod = iterable[iteratorSymbol];

    if (iteratorMethod) {
      return iteratorMethod.call(iterable);
    }

    if (typeof iterable.next === "function") {
      return iterable;
    }

    if (!isNaN(iterable.length)) {
      var i = -1,
          next = function next() {
        while (++i < iterable.length) {
          if (hasOwn.call(iterable, i)) {
            next.value = iterable[i];
            next.done = false;
            return next;
          }
        }

        next.value = undefined$1;
        next.done = true;
        return next;
      };

      return next.next = next;
    }
  } // Return an iterator with no values.


  return {
    next: doneResult
  };
}

function doneResult() {
  return {
    value: undefined$1,
    done: true
  };
}

Context.prototype = {
  constructor: Context,
  reset: function reset(skipTempReset) {
    this.prev = 0;
    this.next = 0; // Resetting context._sent for legacy support of Babel's
    // function.sent implementation.

    this.sent = this._sent = undefined$1;
    this.done = false;
    this.delegate = null;
    this.method = "next";
    this.arg = undefined$1;
    this.tryEntries.forEach(resetTryEntry);

    if (!skipTempReset) {
      for (var name in this) {
        // Not sure about the optimal order of these conditions:
        if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
          this[name] = undefined$1;
        }
      }
    }
  },
  stop: function stop() {
    this.done = true;
    var rootEntry = this.tryEntries[0];
    var rootRecord = rootEntry.completion;

    if (rootRecord.type === "throw") {
      throw rootRecord.arg;
    }

    return this.rval;
  },
  dispatchException: function dispatchException(exception) {
    if (this.done) {
      throw exception;
    }

    var context = this;

    function handle(loc, caught) {
      record.type = "throw";
      record.arg = exception;
      context.next = loc;

      if (caught) {
        // If the dispatched exception was caught by a catch block,
        // then let that catch block handle the exception normally.
        context.method = "next";
        context.arg = undefined$1;
      }

      return !!caught;
    }

    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];
      var record = entry.completion;

      if (entry.tryLoc === "root") {
        // Exception thrown outside of any try block that could handle
        // it, so set the completion value of the entire function to
        // throw the exception.
        return handle("end");
      }

      if (entry.tryLoc <= this.prev) {
        var hasCatch = hasOwn.call(entry, "catchLoc");
        var hasFinally = hasOwn.call(entry, "finallyLoc");

        if (hasCatch && hasFinally) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          } else if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }
        } else if (hasCatch) {
          if (this.prev < entry.catchLoc) {
            return handle(entry.catchLoc, true);
          }
        } else if (hasFinally) {
          if (this.prev < entry.finallyLoc) {
            return handle(entry.finallyLoc);
          }
        } else {
          throw new Error("try statement without catch or finally");
        }
      }
    }
  },
  abrupt: function abrupt(type, arg) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];

      if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
        var finallyEntry = entry;
        break;
      }
    }

    if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
      // Ignore the finally entry if control is not jumping to a
      // location outside the try/catch block.
      finallyEntry = null;
    }

    var record = finallyEntry ? finallyEntry.completion : {};
    record.type = type;
    record.arg = arg;

    if (finallyEntry) {
      this.method = "next";
      this.next = finallyEntry.finallyLoc;
      return ContinueSentinel;
    }

    return this.complete(record);
  },
  complete: function complete(record, afterLoc) {
    if (record.type === "throw") {
      throw record.arg;
    }

    if (record.type === "break" || record.type === "continue") {
      this.next = record.arg;
    } else if (record.type === "return") {
      this.rval = this.arg = record.arg;
      this.method = "return";
      this.next = "end";
    } else if (record.type === "normal" && afterLoc) {
      this.next = afterLoc;
    }

    return ContinueSentinel;
  },
  finish: function finish(finallyLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];

      if (entry.finallyLoc === finallyLoc) {
        this.complete(entry.completion, entry.afterLoc);
        resetTryEntry(entry);
        return ContinueSentinel;
      }
    }
  },
  "catch": function _catch(tryLoc) {
    for (var i = this.tryEntries.length - 1; i >= 0; --i) {
      var entry = this.tryEntries[i];

      if (entry.tryLoc === tryLoc) {
        var record = entry.completion;

        if (record.type === "throw") {
          var thrown = record.arg;
          resetTryEntry(entry);
        }

        return thrown;
      }
    } // The context.catch method must only be called with a location
    // argument that corresponds to a known catch block.


    throw new Error("illegal catch attempt");
  },
  delegateYield: function delegateYield(iterable, resultName, nextLoc) {
    this.delegate = {
      iterator: values(iterable),
      resultName: resultName,
      nextLoc: nextLoc
    };

    if (this.method === "next") {
      // Deliberately forget the last sent value so that we don't
      // accidentally pass it on to the delegate.
      this.arg = undefined$1;
    }

    return ContinueSentinel;
  }
}; // Export a default namespace that plays well with Rollup

var _regeneratorRuntime = {
  wrap,
  isGeneratorFunction,
  AsyncIterator,
  mark,
  awrap,
  async,
  keys,
  values
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function useApiResponse(makeInvocation, dependencies) {
  var _useState = useState({
    data: null,
    hasData: false,
    loading: false,
    error: null
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  useEffect(() => {
    var inv = makeInvocation();
    var options = (typeof inv === "function" ? {
      invocation: inv
    } : inv) || {};
    var invocation = options.invocation,
        _options$discardPrevi = options.discardPreviousData,
        discardPreviousData = _options$discardPrevi === void 0 ? false : _options$discardPrevi,
        _options$discardDataO = options.discardDataOnError,
        discardDataOnError = _options$discardDataO === void 0 ? false : _options$discardDataO,
        _options$abortPreviou = options.abortPreviousRequest,
        abortPreviousRequest = _options$abortPreviou === void 0 ? true : _options$abortPreviou;
    if (!invocation && !discardPreviousData) return;
    setState(prevState => ({
      data: discardPreviousData ? null : prevState.data,
      hasData: discardPreviousData ? false : prevState.hasData,
      loading: invocation != null,
      error: invocation != null || discardPreviousData ? null : prevState.error
    }));
    if (!invocation) return;
    var abortController = new AbortController();
    var mounted = true;
    invocation(abortController.signal).then(data => {
      if (!mounted) return;
      setState({
        data,
        hasData: true,
        loading: false,
        error: null
      });
    }, error => {
      if (!mounted) return;
      setState(prevState => ({
        data: discardDataOnError ? null : prevState.data,
        hasData: discardDataOnError ? false : prevState.hasData,
        loading: false,
        error
      }));
    });
    return () => {
      mounted = false;

      if (abortPreviousRequest) {
        abortController.abort();
      }
    };
  }, dependencies);
  return state;
}

var defaultHttpErrorHandler = response => {
  throw new Error("HTTP Error ".concat(response.status, ": ").concat(response.statusText));
};

function makeJsonFetch() {
  var urlPrefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var defaultHeaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var handleHttpError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : defaultHttpErrorHandler;
  var handleData = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : x => x;
  return function jsonFetch(method, endpoint) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var body = options.body,
        query = options.query,
        headers = options.headers,
        fetchOptions = options.fetchOptions;
    var sentHeaders = {
      ["Accept"]: "application/json"
    };

    if (body != null) {
      sentHeaders["Content-Type"] = "application/json";
    }

    Object.assign(sentHeaders, defaultHeaders);
    Object.assign(sentHeaders, headers);
    var searchParams = new URLSearchParams();

    if (query) {
      for (var key in query) {
        searchParams.set(key, query[key].toString());
      }
    }

    var searchString = searchParams.toString();
    var url = urlPrefix + endpoint + (searchString ? "?" + searchString : "");
    return /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(signal) {
        var response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetch(url, _objectSpread({
                  signal,
                  method,
                  body: body != null ? JSON.stringify(body) : undefined,
                  headers: sentHeaders
                }, fetchOptions));

              case 2:
                response = _context.sent;

                if (response.ok) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return handleHttpError(response);

              case 6:
                return _context.abrupt("return", _context.sent);

              case 7:
                _context.t0 = handleData;
                _context.next = 10;
                return response.json();

              case 10:
                _context.t1 = _context.sent;
                _context.next = 13;
                return (0, _context.t0)(_context.t1);

              case 13:
                return _context.abrupt("return", _context.sent);

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();
  };
}
var jsonFetch = makeJsonFetch();
function mockFetch(entries) {
  return function (method, endpoint) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var match;
    var entry = entries.find((_ref2) => {
      var _ref3 = _slicedToArray(_ref2, 2),
          mtod = _ref3[0],
          regexp = _ref3[1];

      if (mtod !== method) return false;
      match = typeof regexp == "string" ? regexp === endpoint ? [endpoint] : null : endpoint.match(regexp);
      if (!match) return false;
      return true;
    });

    if (entry) {
      return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var _options$body, _options$query;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return entry[2]({
                  endpoint,
                  match,
                  body: (_options$body = options.body) !== null && _options$body !== void 0 ? _options$body : {},
                  query: (_options$query = options.query) !== null && _options$query !== void 0 ? _options$query : {}
                });

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));
    }

    return /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              throw new Error("Endpoint doesn't match any mock");

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
  };
}
var transformApiInvocation = (invocation, transform) => {
  return abortSignal => invocation(abortSignal).then(transform);
};

// TODO
var electionApiProductionUrl = "https://api.rezultatevot.ro/api";
var electionMapOverlayUrl = "//localhost:5000";

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var scopeToQuery = scope => {
  switch (scope.type) {
    case "national":
      return {
        Division: "national"
      };

    case "diaspora":
      return {
        Division: "diaspora"
      };

    case "county":
      return {
        Division: "county",
        CountyId: scope.countyId
      };

    case "locality":
      return {
        Division: "locality",
        CountyId: scope.countyId,
        LocalityId: scope.localityId
      };

    case "diaspora_country":
      return {
        Division: "diaspora_country",
        LocalityId: scope.countryId
      };
  }
};

var makeElectionApi = options => {
  var _options$fetch, _options$apiUrl;

  var fetch = (_options$fetch = options === null || options === void 0 ? void 0 : options.fetch) !== null && _options$fetch !== void 0 ? _options$fetch : makeJsonFetch((_options$apiUrl = options === null || options === void 0 ? void 0 : options.apiUrl) !== null && _options$apiUrl !== void 0 ? _options$apiUrl : electionApiProductionUrl);
  return {
    getElection: (id, scope) => fetch("GET", "/ballot", {
      query: _objectSpread$1({
        BallotId: id
      }, scopeToQuery(scope))
    }),
    getElections: () => fetch("GET", "/ballots"),
    getCounties: () => fetch("GET", "/counties"),
    getLocalities: countyId => fetch("GET", "/localities", {
      query: {
        CountyId: countyId
      }
    }),
    getCountries: () => fetch("GET", "/countries")
  };
};

var electionScopeIsComplete = scope => {
  var missingCounty = (scope.type === "county" || scope.type === "locality") && scope.countyId == null;
  var missingLocality = scope.type === "locality" && scope.localityId == null;
  var missingCountry = scope.type === "diaspora_country" && scope.countryId == null;
  return {
    complete: !missingCounty && !missingLocality && !missingCountry ? scope : null,
    missingCounty,
    missingLocality,
    missingCountry
  };
};
var electionTypeInvolvesDiaspora = electionType => electionType !== "local_council" && electionType !== "county_council" && electionType !== "mayor";
var electionTypeHasSeats = electionType => electionType === "senate" || electionType === "house" || electionType === "local_council" || electionType === "county_council" || electionType === "european_parliament";
var electionHasSeats = (electionType, results) => electionTypeHasSeats(electionType) && results.candidates.reduce((acc, cand) => acc || cand.seats != null, false);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".Typography-module_body__2Sz8H{font-size:.875rem;line-height:1.28;color:#505050}.Typography-module_bodyMedium__3JWs5{font-size:1rem;line-height:1.28;color:#505050}.Typography-module_bodyLarge__15VfE{font-size:1.25rem;line-height:1.28;color:#666}.Typography-module_bodyHuge__3eUkl{font-size:1.5rem;line-height:1.28;color:#737373}.Typography-module_label__2G_hp{font-size:.875rem;line-height:1.28;color:#989898}.Typography-module_labelMedium__2btE1{font-size:1rem;line-height:1.28;color:#989898}.Typography-module_h1__230w2{font-size:1.875rem;line-height:1.5;font-weight:600;color:#3e3e3e}.Typography-module_h2__37F_d{font-size:1.6875rem;line-height:1.5;font-weight:600;color:#3e3e3e}.Typography-module_h3__1NeRd{font-size:1.25rem;line-height:1.5;font-weight:600;color:#3e3e3e}.Typography-module_underlined__2yy6z{text-decoration:underline}";
var cssClasses = {
  "body": "Typography-module_body__2Sz8H",
  "bodyMedium": "Typography-module_bodyMedium__3JWs5",
  "bodyLarge": "Typography-module_bodyLarge__15VfE",
  "bodyHuge": "Typography-module_bodyHuge__3eUkl",
  "label": "Typography-module_label__2G_hp",
  "labelMedium": "Typography-module_labelMedium__2btE1",
  "h1": "Typography-module_h1__230w2",
  "h2": "Typography-module_h2__37F_d",
  "h3": "Typography-module_h3__1NeRd",
  "underlined": "Typography-module_underlined__2yy6z"
};
styleInject(css_248z);

function makeTypographyComponent(Component, className, extraClassName) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var Component_ = Component;
  return themable("Typography", cssClasses)(
  /*#__PURE__*/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forwardRef(function TypographyInner(_ref, ref) {
    var classes = _ref.classes,
        constants = _ref.constants,
        otherProps = _objectWithoutProperties(_ref, ["classes", "constants"]);

    var finalClassName = mergeClasses(mergeClasses(classes[className], extraClassName), classes.root);
    return /*#__PURE__*/React.createElement(Component_, Object.assign({}, otherProps, {
      className: finalClassName,
      ref: ref
    })); // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }));
}
var Body = makeTypographyComponent("span", "body");
var BodyMedium = makeTypographyComponent("span", "bodyMedium");
var BodyLarge = makeTypographyComponent("span", "bodyLarge");
var BodyHuge = makeTypographyComponent("span", "bodyHuge");
var Label = makeTypographyComponent("span", "label");
var LabelMedium = makeTypographyComponent("span", "labelMedium");
var Heading1 = makeTypographyComponent("h1", "h1");
var Heading2 = makeTypographyComponent("h2", "h2");
var Heading3 = makeTypographyComponent("h3", "h3");
var DivBody = makeTypographyComponent("div", "body");
var DivBodyMedium = makeTypographyComponent("div", "bodyMedium");
var DivBodyLarge = makeTypographyComponent("div", "bodyLarge");
var DivBodyHuge = makeTypographyComponent("div", "bodyHuge");
var DivLabel = makeTypographyComponent("div", "label");
var DivLabelMedium = makeTypographyComponent("div", "labelMedium");
var DivHeading1 = makeTypographyComponent("div", "h1");
var DivHeading2 = makeTypographyComponent("div", "h2");
var DivHeading3 = makeTypographyComponent("div", "h3");
var Underlined = makeTypographyComponent("span", "underlined");

var css_248z$1 = ".Button-module_root__32E30{background-color:#352245;color:#fff;font-size:1rem;font-weight:600;padding:.5rem 1rem;border-radius:.5rem;border:none;cursor:pointer}.Button-module_root__32E30:hover{opacity:.9}.Button-module_root__32E30:active{opacity:.8}";
var cssClasses$1 = {
  "root": "Button-module_root__32E30"
};
styleInject(css_248z$1);

var Button = themable("Button", cssClasses$1)(
/*#__PURE__*/
// eslint-disable-next-line react/display-name
forwardRef( // eslint-disable-next-line @typescript-eslint/no-unused-vars
(_ref, forwardedRef) => {
  var classes = _ref.classes,
      className = _ref.className,
      constants = _ref.constants,
      ref = _ref.ref,
      otherProps = _objectWithoutProperties(_ref, ["classes", "className", "constants", "ref"]);

  return /*#__PURE__*/React.createElement("button", Object.assign({
    className: classes.root
  }, otherProps, {
    ref: forwardedRef
  }));
}));

var css_248z$2 = ".ColoredSquare-module_root__3U9BM{display:inline-block;height:1em;width:1em;background-color:#bbb}";
var cssClasses$2 = {
  "root": "ColoredSquare-module_root__3U9BM"
};
styleInject(css_248z$2);

var ColoredSquare = themable("ColoredSquare", cssClasses$2)((_ref) => {
  var classes = _ref.classes,
      color = _ref.color;
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root,
    style: {
      backgroundColor: color
    }
  });
});

var css_248z$3 = ".PartyResultCard-module_root__3E4pe{display:flex;flex-direction:row;align-items:center}.PartyResultCard-module_icon__2CVIP{height:3.5rem;width:auto;margin-right:.5rem}.PartyResultCard-module_column__AVnxr{display:flex;flex-direction:column}.PartyResultCard-module_nameRow__3kg6b{display:flex;flex-direction:row;align-items:center}.PartyResultCard-module_name__x75Bn{margin-left:.5rem}.PartyResultCard-module_percentage__2NFma{line-height:1.2;color:#242424}.PartyResultCard-module_rightAlign__oPF3G{flex-direction:row-reverse}.PartyResultCard-module_rightAlign__oPF3G .PartyResultCard-module_icon__2CVIP{margin-right:0;margin-left:.5rem}.PartyResultCard-module_rightAlign__oPF3G .PartyResultCard-module_column__AVnxr{align-items:flex-end}.PartyResultCard-module_rightAlign__oPF3G .PartyResultCard-module_nameRow__3kg6b{flex-direction:row-reverse}.PartyResultCard-module_rightAlign__oPF3G .PartyResultCard-module_name__x75Bn{margin-left:0;margin-right:.5rem}";
var cssClasses$3 = {
  "root": "PartyResultCard-module_root__3E4pe",
  "icon": "PartyResultCard-module_icon__2CVIP",
  "column": "PartyResultCard-module_column__AVnxr",
  "nameRow": "PartyResultCard-module_nameRow__3kg6b",
  "name": "PartyResultCard-module_name__x75Bn",
  "percentage": "PartyResultCard-module_percentage__2NFma",
  "rightAlign": "PartyResultCard-module_rightAlign__oPF3G"
};
styleInject(css_248z$3);

var formatPercentage = x => new Intl.NumberFormat("ro-RO", {
  style: "percent",
  maximumFractionDigits: 2
}).format(x).replace(/\s+%$/, "%");
var formatGroupedNumber = x => new Intl.NumberFormat("ro-RO", {
  useGrouping: true
}).format(x);
function getScopeName(scope) {
  switch (scope.type) {
    case "national":
      return "Nivel Național";

    case "county":
      return scope.countyName ? "Jude\u021Bul ".concat(scope.countyName) : "Județ";

    case "locality":
      return scope.localityName ? "Localitatea ".concat(scope.localityName) : "Localitate";

    case "diaspora":
      return "Diaspora";

    case "diaspora_country":
      return scope.countryName ? "Diaspora din ".concat(scope.countryName) : "Țară din Diaspora";
  }
}
var fractionOf = (x, total) => {
  var percent = x / total;
  return Number.isFinite(percent) ? percent : 0;
};

function hashCode(s) {
  var i, h;

  for (i = 0, h = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  }

  return h;
}

function mulberry32(a) {
  return function () {
    var t = a += 0x6d2b79f5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

var randomColor = seed => {
  return "hsl(".concat(mulberry32(hashCode(seed))() * 360.0, ", 50%, 50%)");
};
var electionCandidateColor = candidate => {
  var _candidate$partyColor;

  return (_candidate$partyColor = candidate.partyColor) !== null && _candidate$partyColor !== void 0 ? _candidate$partyColor : randomColor(candidate.name);
};

var PartyResultCard = themable("PartyResultCard", cssClasses$3)((_ref) => {
  var classes = _ref.classes,
      name = _ref.name,
      color = _ref.color,
      percentage = _ref.percentage,
      rightAligned = _ref.rightAligned,
      iconUrl = _ref.iconUrl;
  return /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.root, rightAligned && classes.rightAlign)
  }, iconUrl && /*#__PURE__*/React.createElement("img", {
    className: classes.icon,
    src: iconUrl,
    alt: name
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.column
  }, /*#__PURE__*/React.createElement(DivBodyMedium, {
    className: classes.nameRow
  }, /*#__PURE__*/React.createElement(ColoredSquare, {
    className: classes.square,
    color: color
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.name
  }, name)), /*#__PURE__*/React.createElement(DivHeading1, {
    className: classes.percentage
  }, formatPercentage(percentage))));
});

var css_248z$4 = ".PartyResultInline-module_root__5vc7_{display:flex;flex-direction:row;align-items:center}.PartyResultInline-module_square__2G7-y{display:block;margin-right:.5em}.PartyResultInline-module_votes__1d6Yw{margin-left:.5em}";
var cssClasses$4 = {
  "root": "PartyResultInline-module_root__5vc7_",
  "square": "PartyResultInline-module_square__2G7-y",
  "votes": "PartyResultInline-module_votes__1d6Yw"
};
styleInject(css_248z$4);

var PartyResultInline = themable("PartyResultInline", cssClasses$4)((_ref) => {
  var classes = _ref.classes,
      name = _ref.name,
      color = _ref.color,
      percentage = _ref.percentage,
      votes = _ref.votes;
  return /*#__PURE__*/React.createElement(DivBody, {
    className: classes.root
  }, /*#__PURE__*/React.createElement(ColoredSquare, {
    color: color,
    className: classes.square
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.text
  }, /*#__PURE__*/React.createElement("span", {
    className: classes.name
  }, name), /*#__PURE__*/React.createElement(Label, {
    className: classes.votes
  }, percentage != null && votes != null && "".concat(formatPercentage(percentage), " (").concat(formatGroupedNumber(votes), ")"), percentage == null && votes != null && formatGroupedNumber(votes), percentage != null && votes == null && formatPercentage(percentage))));
});

var css_248z$5 = ".HorizontalStackedBar-module_root__2ZEf_{position:relative}.HorizontalStackedBar-module_svg__2A8aG{width:100%;height:5rem}.HorizontalStackedBar-module_labelLeft__3KEUn{position:absolute;left:.25rem;bottom:1rem;text-align:left;color:#fff;font-weight:600}.HorizontalStackedBar-module_labelRight__dLouo{position:absolute;right:.25rem;bottom:1rem;text-align:right;color:#fff;font-weight:600}";
var cssClasses$5 = {
  "root": "HorizontalStackedBar-module_root__2ZEf_",
  "svg": "HorizontalStackedBar-module_svg__2A8aG",
  "labelLeft": "HorizontalStackedBar-module_labelLeft__3KEUn",
  "labelRight": "HorizontalStackedBar-module_labelRight__dLouo"
};
styleInject(css_248z$5);

var HorizontalStackedBar = themable("PercentageBars", cssClasses$5)((_ref) => {
  var total = _ref.total,
      items = _ref.items,
      labelLeft = _ref.labelLeft,
      labelRight = _ref.labelRight,
      classes = _ref.classes;
  var multiplier = 100.0 / (total !== null && total !== void 0 ? total : items.reduce((acc, bar) => acc + bar.value, 0));
  var sum = 0;
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement("svg", {
    className: classes.svg,
    preserveAspectRatio: "none",
    viewBox: "0 0 100 80"
  }, items.map((item, index) => {
    var x = sum * multiplier;
    sum += item.value;
    return /*#__PURE__*/React.createElement("rect", {
      key: index,
      className: item.className,
      x: x,
      y: 8,
      width: item.value * multiplier,
      height: 64,
      fill: item.color
    });
  }), /*#__PURE__*/React.createElement("line", {
    x1: 50,
    x2: 50,
    y1: 0,
    y2: 80,
    vectorEffect: "non-scaling-stroke",
    strokeWidth: 1.5,
    stroke: "#443F46"
  })), labelLeft != null && /*#__PURE__*/React.createElement(DivBody, {
    className: classes.labelLeft
  }, labelLeft), labelRight != null && /*#__PURE__*/React.createElement(DivBody, {
    className: classes.labelRight
  }, labelRight));
});

var css_248z$6 = ".PercentageBars-module_bar__1cuHu{height:3.4375rem;width:100%;background-color:#000;position:relative}.PercentageBars-module_bar__1cuHu:not(:first-child){margin-top:-1.25rem}.PercentageBars-module_label__1OOhk{color:#fff;position:absolute;top:0;right:.5rem;font-size:1.375rem;font-weight:600;line-height:1.5}";
var cssClasses$6 = {
  "bar": "PercentageBars-module_bar__1cuHu",
  "label": "PercentageBars-module_label__1OOhk"
};
styleInject(css_248z$6);

var PercentageBars = themable("PercentageBars", cssClasses$6)((_ref) => {
  var total = _ref.total,
      items = _ref.items,
      classes = _ref.classes;
  var multiplier = 100.0 / (total !== null && total !== void 0 ? total : items.reduce((acc, bar) => Math.max(acc, bar.value), 0));
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, items.map((item, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: mergeClasses(classes.bar, item.className),
    style: {
      backgroundColor: item.color,
      width: "".concat(item.value * multiplier, "%")
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.label
  }, item.valueLabel))));
});

var css_248z$7 = ".PercentageBarsLegend-module_root__20-zG{margin-top:.5rem}.PercentageBarsLegend-module_colorSquare__39t5m{display:inline-block;height:1em;width:1em;background-color:#000;margin-right:.5em}.PercentageBarsLegend-module_valueLabel___7XDq{font-size:1.42857em;font-weight:600;color:#000}";
var cssClasses$7 = {
  "root": "PercentageBarsLegend-module_root__20-zG",
  "colorSquare": "PercentageBarsLegend-module_colorSquare__39t5m",
  "valueLabel": "PercentageBarsLegend-module_valueLabel___7XDq"
};
styleInject(css_248z$7);

function exists(x) {
  return x || false;
}

var PercentageBarsLegend = themable("PercentageBarsLegend", cssClasses$7)((_ref) => {
  var items = _ref.items,
      classes = _ref.classes;
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, items.map((item, index) => {
    var _item$legendColor, _item$legendValueLabe, _item$legendValueLabe2;

    return /*#__PURE__*/React.createElement(DivBody, {
      key: index,
      className: mergeClasses(classes.item, item.legendClassName)
    }, /*#__PURE__*/React.createElement("div", {
      className: classes.colorSquare,
      style: {
        backgroundColor: (_item$legendColor = item.legendColor) !== null && _item$legendColor !== void 0 ? _item$legendColor : item.color
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: classes.name
    }, item.legendName), exists((_item$legendValueLabe = item.legendValueLabel) !== null && _item$legendValueLabe !== void 0 ? _item$legendValueLabe : item.valueLabel) && /*#__PURE__*/React.createElement(React.Fragment, null, " - ", /*#__PURE__*/React.createElement("span", {
      className: classes.valueLabel
    }, (_item$legendValueLabe2 = item.legendValueLabel) !== null && _item$legendValueLabe2 !== void 0 ? _item$legendValueLabe2 : item.valueLabel)), exists(item.legendNote) && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("span", {
      className: classes.note
    }, item.legendNote)));
  }));
});

var defaultConstants = {
  gridLabelColor: "#C1C1C1",
  gridColor: "#E2E2E2"
};
var BarChart = themable("BarChart", undefined, defaultConstants)((_ref) => {
  var classes = _ref.classes,
      constants = _ref.constants,
      width = _ref.width,
      height = _ref.height,
      yGridSteps = _ref.yGridSteps,
      yMax = _ref.yMax,
      fontSize = _ref.fontSize,
      renderLabel = _ref.renderLabel,
      maxBarSpacing = _ref.maxBarSpacing,
      minBarSpacing = _ref.minBarSpacing,
      maxBarWidth = _ref.maxBarWidth,
      minBarWidth = _ref.minBarWidth,
      leftBarMargin = _ref.leftBarMargin,
      rightBarMargin = _ref.rightBarMargin,
      bars = _ref.bars;
  var yScale = (height - fontSize - 2) / yMax;
  var lines = [];
  var labels = [];

  for (var i = 0; i <= yGridSteps; i++) {
    var value = i * (yMax / yGridSteps);
    var y = Math.round(height - yScale * value);
    var lineY = y - 0.5; // to account for line width and prevent aliasing;

    lines.push( /*#__PURE__*/React.createElement("line", {
      key: i,
      stroke: constants.gridColor,
      x1: 0,
      x2: width,
      y1: lineY,
      y2: lineY
    }));
    labels.push( /*#__PURE__*/React.createElement("text", {
      key: i,
      textAnchor: "end",
      x: width,
      y: y - 2,
      className: classes.yGridLabel,
      fill: constants.gridLabelColor,
      style: {
        fontSize
      }
    }, renderLabel(value)));
  }

  var usableBarWidth = width - leftBarMargin - rightBarMargin;
  var spacingRatio = maxBarSpacing / (maxBarSpacing + maxBarWidth);
  var desiredStride = usableBarWidth / (bars.length + spacingRatio);
  var barSpacing = Math.max(minBarSpacing, Math.min(maxBarSpacing, desiredStride * spacingRatio));
  var barWidth = Math.max(minBarWidth, Math.min(maxBarWidth, desiredStride - barSpacing));
  var stride = barSpacing + barWidth;
  var barRects = bars.map((_ref2, index) => {
    var value = _ref2.value,
        color = _ref2.color;
    return /*#__PURE__*/React.createElement("rect", {
      key: index,
      x: index * stride + barSpacing,
      y: height - yScale * value,
      width: barWidth,
      height: yScale * value,
      fill: color
    });
  });
  return /*#__PURE__*/React.createElement("svg", {
    className: classes.root,
    width: width,
    height: height,
    viewBox: "0 0 ".concat(width, " ").concat(height)
  }, lines, labels, barRects);
}); // To make defaultProps work

BarChart.defaultProps = {
  width: 220,
  height: 100,
  yGridSteps: 4,
  yMax: 1.0,
  fontSize: 10,
  minBarSpacing: 1,
  minBarWidth: 1,
  maxBarSpacing: 24,
  maxBarWidth: 48,
  leftBarMargin: 0,
  rightBarMargin: 40,
  renderLabel: x => x,
  bars: []
};

var css_248z$8 = ".ElectionMap-module_root__rzXaf{position:relative}.ElectionMap-module_container__VL7Lu{position:absolute;top:0;left:0;display:flex;flex-direction:column;align-items:stretch;justify-content:stretch}.ElectionMap-module_staticMap__1FBdJ{flex:1;width:100%;align-self:center;display:flex;flex-direction:row;align-items:stretch;justify-content:center}.ElectionMap-module_staticMapRomaniaContainer__3JyEh{flex:2;position:relative;display:flex;justify-content:center;align-items:center}.ElectionMap-module_staticMapRomania__2DFcs{width:100%;height:100%}.ElectionMap-module_staticMapWorldContainer__3GWdI{margin-left:-10%;flex:1;display:flex;flex-direction:column;align-items:stretch}.ElectionMap-module_staticMapWorldLabel__2l6Kl{font-size:18em/16;font-weight:600;color:#3e3e3e;margin-bottom:.5em}";
var cssClasses$8 = {
  "root": "ElectionMap-module_root__rzXaf",
  "container": "ElectionMap-module_container__VL7Lu",
  "staticMap": "ElectionMap-module_staticMap__1FBdJ",
  "staticMapRomaniaContainer": "ElectionMap-module_staticMapRomaniaContainer__3JyEh",
  "staticMapRomania": "ElectionMap-module_staticMapRomania__2DFcs",
  "staticMapWorldContainer": "ElectionMap-module_staticMapWorldContainer__3GWdI",
  "staticMapWorldLabel": "ElectionMap-module_staticMapWorldLabel__2l6Kl"
};
styleInject(css_248z$8);

function getDimensionObject(node) {
  var rect = node.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: "x" in rect ? rect.x : rect.top,
    left: "y" in rect ? rect.y : rect.left,
    x: "x" in rect ? rect.x : rect.left,
    y: "y" in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom
  };
}

function useDimensions() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$liveMeasure = _ref.liveMeasure,
      liveMeasure = _ref$liveMeasure === undefined ? true : _ref$liveMeasure;

  var _useState = useState({}),
      dimensions = _useState[0],
      setDimensions = _useState[1];

  var _useState2 = useState(null),
      node = _useState2[0],
      setNode = _useState2[1];

  var ref = useCallback(function (node) {
    setNode(node);
  }, []);
  useLayoutEffect(function () {
    if (node) {
      var measure = function measure() {
        return window.requestAnimationFrame(function () {
          return setDimensions(getDimensionObject(node));
        });
      };

      measure();

      if (liveMeasure) {
        window.addEventListener("resize", measure);
        window.addEventListener("scroll", measure);
        return function () {
          window.removeEventListener("resize", measure);
          window.removeEventListener("scroll", measure);
        };
      }
    }
  }, [node]);
  return [ref, dimensions, node];
}

var css_248z$9 = "@import url(\"https://js.api.here.com/v3/3.1/mapsjs-ui.css\");.HereMap-module_root__AxCbR{position:relative}.HereMap-module_tooltip__2tSSL{position:absolute;left:0;top:0;transform:translate(-50%,calc(-100% - 8px));font-size:12rem/16;color:#fff;border-radius:.25rem;padding:.5rem;background-color:#000;white-space:nowrap}";
var cssClasses$9 = {
  "root": "HereMap-module_root__AxCbR",
  "tooltip": "HereMap-module_tooltip__2tSSL"
};
styleInject(css_248z$9);

var worldMapBounds = {
  top: 90,
  left: 0,
  bottom: -90,
  right: 180
};
var romaniaMapBounds = {
  top: 48.26534497800004,
  bottom: 43.618995545000075,
  left: 20.261959895000075,
  right: 29.715232741000037
};

var loadJS = src => new Promise((resolve, reject) => {
  var _window, _window$document;

  var script = document.createElement("script");
  script.addEventListener("load", resolve);
  script.addEventListener("error", reject);
  script.src = src;
  (_window = window) === null || _window === void 0 ? void 0 : (_window$document = _window.document) === null || _window$document === void 0 ? void 0 : _window$document.getElementsByTagName("head")[0].appendChild(script);
});

var loadHereMaps = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return loadJS("https://js.api.here.com/v3/3.1/mapsjs-core.js");

          case 2:
            _context.next = 4;
            return Promise.all([loadJS("https://js.api.here.com/v3/3.1/mapsjs-service.js"), loadJS("https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"), loadJS("https://js.api.here.com/v3/3.1/mapsjs-ui.js"), loadJS("https://js.api.here.com/v3/3.1/mapsjs-data.js")]);

          case 4:
            return _context.abrupt("return", window.H);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function loadHereMaps() {
    return _ref.apply(this, arguments);
  };
}();

var hereMapsPromise = null;

var getHereMaps = () => {
  if (hereMapsPromise) {
    return hereMapsPromise;
  }

  hereMapsPromise = loadHereMaps();
  return hereMapsPromise;
};

getHereMaps(); // Load on startup

var useHereMaps = () => {
  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      savedH = _useState2[0],
      setH = _useState2[1];

  useEffect(() => {
    var set = setH;
    getHereMaps().then(H => {
      if (set) {
        set(H);
      }
    });
    return () => {
      set = null;
    };
  }, []);
  return savedH;
};

var HereMapsAPIKeyContext = /*#__PURE__*/createContext("");
var HereMapsAPIKeyProvider = HereMapsAPIKeyContext.Provider;
var defaultValues = {
  featureStroke: "#FFCC00",
  featureFill: "rgba(255, 204, 0, 0.3)",
  featureHoverFill: "rgba(255, 204, 0, 0.6)"
};
var HereMap = themable("HereMap", cssClasses$9, defaultValues)((_ref2) => {
  var _classes$tooltip;

  var classes = _ref2.classes,
      constants = _ref2.constants,
      width = _ref2.width,
      height = _ref2.height,
      overlayUrl = _ref2.overlayUrl,
      selectedFeature = _ref2.selectedFeature,
      onFeatureSelect = _ref2.onFeatureSelect,
      _ref2$initialBounds = _ref2.initialBounds,
      initialBounds = _ref2$initialBounds === void 0 ? worldMapBounds : _ref2$initialBounds,
      _ref2$centerOnOverlay = _ref2.centerOnOverlayBounds,
      centerOnOverlayBounds = _ref2$centerOnOverlay === void 0 ? true : _ref2$centerOnOverlay;
  var H = useHereMaps();
  var apiKey = useContext(HereMapsAPIKeyContext);
  var mapRef = useRef(null);

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      map = _useState4[0],
      setMap = _useState4[1];

  var featureStyles = useMemo(() => H && {
    default: new H.map.SpatialStyle({
      fillColor: constants.featureFill,
      strokeColor: constants.featureStroke,
      lineWidth: 2
    }),
    selected: new H.map.SpatialStyle({
      fillColor: constants.featureStroke,
      strokeColor: constants.featureStroke,
      lineWidth: 2
    }),
    hover: new H.map.SpatialStyle({
      fillColor: constants.featureHoverFill,
      strokeColor: constants.featureHoverFill,
      lineWidth: 2
    })
  }, [H, constants.featureFill, constants.featureStroke, constants.featureHoverFill]); // Instance vars

  var inst = useRef({
    selectedFeature,
    hoveredFeature: null,
    onFeatureSelect,
    group: null,
    features: null,
    tooltipEl: null,
    tooltipClassName: (_classes$tooltip = classes.tooltip) !== null && _classes$tooltip !== void 0 ? _classes$tooltip : null,
    tooltipTop: 0,
    tooltipLeft: 0,
    centerOnOverlayBounds
  });
  useLayoutEffect(() => {
    if (!H || !apiKey || !mapRef.current) {
      return;
    }

    var self = inst.current;
    var platform = new H.service.Platform({
      apikey: apiKey
    });
    var defaultLayers = platform.createDefaultLayers();
    var hMap = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      bounds: new H.geo.Rect(initialBounds.top, initialBounds.left, initialBounds.bottom, initialBounds.right),
      pixelRatio: window.devicePixelRatio || 1
    });
    setMap(hMap);
    new H.mapevents.Behavior(new H.mapevents.MapEvents(hMap));
    H.ui.UI.createDefault(hMap, defaultLayers); // eslint-disable-next-line @typescript-eslint/no-explicit-any

    hMap.addEventListener("pointermove", evt => {
      var _evt$originalEvent = evt.originalEvent,
          _evt$originalEvent$of = _evt$originalEvent.offsetX,
          offsetX = _evt$originalEvent$of === void 0 ? 0 : _evt$originalEvent$of,
          _evt$originalEvent$of2 = _evt$originalEvent.offsetY,
          offsetY = _evt$originalEvent$of2 === void 0 ? 0 : _evt$originalEvent$of2;
      self.tooltipLeft = offsetX;
      self.tooltipTop = offsetY;

      if (self.tooltipEl) {
        self.tooltipEl.style.left = "".concat(offsetX, "px");
        self.tooltipEl.style.top = "".concat(offsetY, "px");
      }
    });
    return () => {
      hMap.dispose();
      hMap.disposed = true; // eslint-disable-line @typescript-eslint/no-explicit-any

      setMap(state => state === hMap ? null : state);
    };
  }, [H, apiKey, mapRef]);
  useLayoutEffect(() => {
    if (map) {
      map.getViewPort().resize();
    }
  }, [width, height, map]); // Whenever selectedFeature changes

  useLayoutEffect(() => {
    if (!featureStyles) return;
    var self = inst.current;
    var features = self.features,
        lastSelectedFeature = self.selectedFeature,
        hoveredFeature = self.hoveredFeature;
    self.selectedFeature = selectedFeature; // De-select previously selected feature

    if (features && typeof lastSelectedFeature === "number") {
      var feature = features.get(lastSelectedFeature);

      if (feature) {
        feature.setStyle(lastSelectedFeature === (hoveredFeature === null || hoveredFeature === void 0 ? void 0 : hoveredFeature.id) ? featureStyles.hover : featureStyles.default);
      }
    } // Select new feature


    if (features && typeof selectedFeature === "number") {
      var _feature = features.get(selectedFeature);

      if (_feature) {
        _feature.setStyle(featureStyles.selected);
      }
    }
  }, [selectedFeature]);
  useLayoutEffect(() => {
    inst.current.onFeatureSelect = onFeatureSelect;
  }, [onFeatureSelect]);
  useLayoutEffect(() => {
    inst.current.centerOnOverlayBounds = centerOnOverlayBounds;
  }, [centerOnOverlayBounds]);
  useLayoutEffect(() => {
    var self = inst.current;
    self.tooltipClassName = classes.tooltip;

    if (self.tooltipEl) {
      self.tooltipEl.className = classes.tooltip;
    }
  }, [classes.tooltip]);
  useLayoutEffect(() => {
    if (!H || !map || !overlayUrl || !featureStyles) return;
    var self = inst.current;

    var setHoveredFeature = (id, name) => {
      var hadTooltip = !!self.hoveredFeature;
      var hasTooltip = id != null && name != null;
      self.hoveredFeature = id != null && name != null ? {
        id,
        name
      } : null;

      if (!hadTooltip && hasTooltip) {
        var _mapRef$current;

        var tooltipEl = document.createElement("div");
        tooltipEl.className = self.tooltipClassName || "";
        tooltipEl.style.left = "".concat(self.tooltipLeft, "px");
        tooltipEl.style.top = "".concat(self.tooltipTop, "px");
        (_mapRef$current = mapRef.current) === null || _mapRef$current === void 0 ? void 0 : _mapRef$current.appendChild(tooltipEl);
        self.tooltipEl = tooltipEl;
      } else if (hadTooltip && !hasTooltip) {
        var _self$tooltipEl;

        (_self$tooltipEl = self.tooltipEl) === null || _self$tooltipEl === void 0 ? void 0 : _self$tooltipEl.remove();
        self.tooltipEl = null;
      }

      if (name && self.tooltipEl) {
        self.tooltipEl.innerText = name;
      }
    };

    var onPointerEnter = evt => {
      var mapObject = evt.target;

      if (mapObject instanceof H.map.Polygon) {
        var data = mapObject.getData();
        var id = data === null || data === void 0 ? void 0 : data.id;
        var isCurrent = id === self.selectedFeature;
        setHoveredFeature(id, data === null || data === void 0 ? void 0 : data.name);

        if (!isCurrent) {
          mapObject.setStyle(featureStyles.hover);
        }
      }
    };

    var onPointerLeave = evt => {
      var mapObject = evt.target;

      if (mapObject instanceof H.map.Polygon) {
        var _self$hoveredFeature;

        var data = mapObject.getData();
        var id = data === null || data === void 0 ? void 0 : data.id;
        var isCurrent = id === self.selectedFeature;

        if (((_self$hoveredFeature = self.hoveredFeature) === null || _self$hoveredFeature === void 0 ? void 0 : _self$hoveredFeature.id) === id) {
          setHoveredFeature(null, null);
        }

        mapObject.setStyle(isCurrent ? featureStyles.selected : featureStyles.default);
      }
    };

    var onTap = evt => {
      var mapObject = evt.target;

      if (mapObject instanceof H.map.Polygon) {
        var _mapObject$getData;

        var id = (_mapObject$getData = mapObject.getData()) === null || _mapObject$getData === void 0 ? void 0 : _mapObject$getData.id;
        var callback = self.onFeatureSelect;

        if (callback && typeof id === "number") {
          callback(id);
        }
      }
    }; // eslint-disable-next-line @typescript-eslint/no-explicit-any


    var reader = new H.data.geojson.Reader(overlayUrl, {
      disableLegacyMode: true,
      style: mapObject => {
        if (mapObject instanceof H.map.Polygon) {
          var data = mapObject.getData();
          mapObject.setStyle((data === null || data === void 0 ? void 0 : data.id) === self.selectedFeature ? featureStyles.selected : featureStyles.default);
          mapObject.addEventListener("pointerenter", onPointerEnter);
          mapObject.addEventListener("pointerleave", onPointerLeave);
        }
      }
    });
    var group = null;
    reader.addEventListener("statechange", () => {
      if (reader.getState() !== H.data.AbstractReader.State.READY) return;
      group = reader.getParsedObjects().find(object => {
        if (object instanceof H.map.Group) {
          return true;
        }
      });
      if (!group) return;
      var features = new Map();
      group.getObjects().forEach(object => {
        if (object instanceof H.map.Polygon) {
          var _object$getData;

          var id = (_object$getData = object.getData()) === null || _object$getData === void 0 ? void 0 : _object$getData.id;

          if (typeof id === "number") {
            features.set(id, object);
          }
        }
      });
      self.features = features;
      group.addEventListener("tap", onTap);
      map.addObject(group);

      if (self.centerOnOverlayBounds) {
        map.getViewModel().setLookAtData({
          bounds: group.getBoundingBox()
        }, true);
      }
    });
    reader.parse();
    return () => {
      var _self$tooltipEl2;

      self.hoveredFeature = null;
      self.features = null;
      (_self$tooltipEl2 = self.tooltipEl) === null || _self$tooltipEl2 === void 0 ? void 0 : _self$tooltipEl2.remove();
      self.tooltipEl = null;
      reader.dispose(); // eslint-disable-next-line @typescript-eslint/no-explicit-any

      if (group && !map.disposed) {
        map.removeObject(group);
        group = null;
      }
    };
  }, [H, map, overlayUrl]);

  if (!H || !apiKey) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: classes.root,
    ref: mapRef,
    style: {
      width,
      height
    }
  });
});

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var RomaniaMap = function RomaniaMap(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    fill: "#FFDC01"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1786.8 1022.2l-1.2 3.3-2.5 3.2-4.3 10.8 9.5-16-1.5-1.3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1922.3 874.7l-5.5 1-5.5-4.5-3-6.5 5-4 5.2 1.2-1.8-18-9.1-21.7-14.8-13-35-11.7-19.2 1.5-2 2.5-3.8 1.5-4.5-1.3-4.2.3-20.8 16.7-18.2 4.5-17.3 12.8-2 3.2.3 4.5-2 4.3-23.8-14.3-4-.2-3.5 2 4 7 .5 3.7-9.2 2.5-1.5 3.3 2.5 3.2 4 2.8 1 3.7-22.8 6.3-10.2-4.5-15-.8-43.3-21.5-16.5-34-7.5-4.7-4.2-1.3-4.1.6-3.8-7.6-3.1-2.6-6-20.7-6.2-5-.9-4.1 2.1-3 3.8.4 3.1-1.6.5-3.4 1.4-3.3 1.2-11.9-1.6-3.3.7-11.2-2.4-2.8-1.2-2.9-.9-7.6-5.8-2.6-1.2-2.6.3-3.6-2.4-3.3-.2-10.7 2.1-2.6 1.2-3.1-1-2.6-.2-3.1 1.2-3.6-8.8-29.9v-3.8l2.2-7.2-1.5-3.3-.2-3.5 2.1-3.4v-3.8l3.8-5.9.3-3.4-.8-3 2.9-11-6.2-14.2.3-4.3 2.6-2.2 1.4-6.6 4-4.5 5.5-3.6 1.9-2.1 1.5-3.4-2.9-6.4-.5-3.1.7-3.3 8.1-11.2-.5-3.3 4.1-6.4v-4.8l-9.5-16.6 3.1-16.6-1.7-2.9.7-3.1 3.1-2.4 1.4-5.2-5.9-20.4-2.2-2.9-1.9-6.4-5.9-7.4-1.9-11.1-2.2-3.4-6.4-5-4.7-10 1.1-1.4.3-1.9-2.4-2.1 1-6.4-3.1-2.4-1.4-2.9 1.9-2.4.9-.7v-1.6l-5-13.6 1.9-2.6-1.4-2.6-9.5-9-1-2.4-7.3-.7-30.9-25.2-1.7-3.1-2.8-1.9-3.8-1.2-2.2-2.1 1.9-5.3-5.9-15.7-5-5.2-3.8-13.5-7.4-3.1-3.1 1.9-2.8-1.5-2.2-2.6-3.3-.2-8.3-5.2.2-7.2-6.4-9.7.2-7.6-1.6-3.1-2.6-2.4-.3-4.3 1.9-2.6.5-3.1-5.7-4-3.6-.7-3.8.9-8-4.7-1.2-3.1.4-4.5-4.2-5.5-.8-3.8-2.8-1.7-1-2.6.3-2.6-9.5-5.2-3.4-6.7-5.4-3.6-12.9-21.3-.4-3.6 3.5-1 1.7-2.1.7-3.1-2.4-1.9-1.6-3.1-.9-4.1-3.1-4.5-2.6-1.9-1.6-2.3-.2-2.7-2.7-4.5 4.2-1.2-8.2-7.2-.2-2.9.7-2.5-3.7-9.6-7.1-4.2.4-2.5 2.1-2.7-.1-2.5-4.2-3.2.1-2.7 1.4-2 .5-2.7-1-2h-2.7l-3.2-1.4-1.2-2v-1.7h-3.3l-2.9-2.8 2.4-2.4-1.4-1.7-3.6-1.6.5-3.3-9.1-8.9-.2-2.8 1.9-2.6-1.4-3.8-2.4-3.3-2.4-1.7-2.6 2.4-4.1-1.5-3.5-3.1 2.1-1.8 3.4-1-1.5-2.8-4 .9-4.3-.9v-3.9l1.9-3.3-.7-2.8-4.3-.7-3.6.7 2.2 2.1v2.9l-3.3-2-1-2.8-7.1-7.8-3.3-1.5-5.5-5.4-2.9-.3-3.5 1.4-15.2-1.6-3.4.7-8.1-1.9-3.8 1.4-1.6 3.4-2.6-.5-4.3.7-3.3 5.5-3.6 1.6-15.7 1.2-1.9 2.9-10 4.7-3.3-.7-2.4-1.4-2.6 2.1-3.8 1.2-2.4 1.7 1.2 2.8V30l-8.5 12.6-2.4 9.9-9.3 5.7-7.4 18.8-14 5.7-8.1-2.4h-4.5l-10.9 4.1-15.2-1.7-4.8 4.3-7.3-.9-3.9.9-9.2 6.7-91.8 8.1-2.8 1.1-4.1 5.5-3.6 1.7-3.3-2.4-2.8 1.2-6.9 16.9-2.6 2.3-3.1 10.5-3.6.9-7.4 10.3-3.3 1.9-6.6 1.6-1.7 3.4-3.3.4-2.9-1.4-3.8 1.7-21.6-.5-3.3-8.3-7.4-7.6-1.7-10.5-7.6-2.1-2.6-3.6-.7-.2-4.5 1.4-2.2-2.2-2.6.5-3.6-.9-1.4-3.6-3.1-1.4-3.3-3.1-.5-3.1 1.2-2.6.2-3.4-10.4-14-3.6-.4-4.7-4.6-12.6 4.1h-3.6l-2.8-1.5-3.4-.6-3.5-2.2-7.6 2.4-8.3 10.9-3.4-.2-3.3-1.2-3.1.7-4.8 4.1-7.8 1.4-2.6 1.4-3.8-1.7-2.6-2.1-3.8-1.7-3.6-.2-2.9 1-4-.3-3.8-1.9-3.1-5.7-3.1-1.9-8.3-.7-3.3-3.1-3.1-1.2-2.9 1-3.8-1-5.9 3.8-10.2 2.1-1.9 1.9-2.7-.9-1.4-2.6-3.5-1.9-1.9-6.2-2.7-2.4-4.3-.5-4.1-2.8h-5.4l-3.4 2.7-4.7-1.7-5 2-8.8-5.7-10.4 1.4-3.3-2.7-4.3-1.2-1.1.2-4.4 10-2.9 1.4h-2.2l-4.3-1.7-3.4-3.4-5.3-1.3-7.8-6.4-5.4-1.7-4-7-5-1.4-2.4-4.3 2-5.1-6.7-6.4-4.7 2-5-.3-3.4-3.4-2.4-4.7-3-.3-2.7 1.3-.6 5.4-4.1 1.4v3.7l-3.3 3.3-1.4 5.1 1 4.7-3.7 2.7 1 4-9.7 1.7-3.7 2.3-8.4-4h-5.7l-4.8-3-2.3 4 3.4 3 .3 10.1h-5.4l-4 2-5.4 9.1-4 3.4-5.4.3-5 3-5.4.4-1.4 3.7 1.1 9.4-3.1 3.7-5.7-1-7.7 13.4-4.4 2.7-21.2 1.7-13.1-10.1h-3.7l-4.7 3-5 13.8-4.1-.7-4 2.1-5.4-2.7-4-4.4-3.7 2.7-.7 4-4.7 2.7-4.7 1-2 8.8-4.7 2-3 2.7.3 5-1.4 1.7-4.3 13.8-3.4 3-8.1 1.4-1.6 4.3-4.4 2.7-2.4 2.7-3.3-1.3-4.1 4 2.1 4h-3.8l-4 1.7-4 9.4-.7 4.7 4.4 16.2-1.3 7.7v.5l-3.1 3.8-10.4 1-3.7 2.1-13.8 25.5 1.4 4.1-6.1 7-1.7 3.7 2.4 4.7-.4 4.7-2 3.4-7 6.7-2 3.4-2.4 8.4-2.7 3.7-5.4.6-8.1 4.8-5.6 10-7.8 4.4 2.4 5.4 3 3-2 9.1.3 4.3-3.7 2.1-3.3 3.7-5.4 1-3 3.3.3 5.8 1.7 4.7-2.7 3v4l-14.2 6.4-2.6 4.4v5.7l-2 5.4-3.8 2.7-1 4.7 3.7 3 3.4 4.7.3 4.7-4.3 3.7-2.2 3.6-14-.9-.5 3.6 5.3 4.7-.1 2.6-.4 1.2-7.4 1.7-1.7 2.1v2.9l-7.1-2.6-9.5 2.8-2.1 2.4-2.9 6.4 1.7 3.1-.2 3.1-2 2.1-1.1 2.7-1.9 2.1-3.9 1.6-3.3 11.4 2.6 6.5 4.1 1.2 3.5 6.6-.4 3.8-3.8 6v3.1l-2.7 1.4-3.3-2.2-7.6-.4-2.8 2.4-3.6 17.3-3.1 1.4-2.6 5.5 2.1 3.1-2.8 2.8-7.4-1.6-3.3 1.2-1.9 3-.7 4.3-4.8 5.3-3.1 1.9-3.3-1-5.2-5-4.1 1-7.8-1.5-4.5-4.2-3.4.7-1.9 2.8-3-.9-4.6-6-20.2 2.4-3.3 2.1-1.9 3.6-.5 7.6 1.7 4.1-2.6 1.6-3.8.3-6 13.3-2.4 1.9-.6 1-1 .9-3.4.5-3.3-1.5-.7 3.6-2.4 2.9-19.9-18.4-3.8-.2-1.9-2.1-2.7 1.4-.7 6.2-3.8 4.3-3.1 1.6-4.2-.5-6.7-4-8.1-.7-.9-2.9-3.6 1-2.8 1.9-6.5.9-7.1 6.5 1.2 2.8-1.2 1.7.5 3.8 3.1 2.1 3.8 1.2.7 3.3 1.7 3.1 2.8 2.6.7 1.2.5.3 2.9 18.3 9.7 9 3.8-1.4h4.3l1.9 3.1 3.3 2.6 6 17.6 3.7 1.2 5.8-4.3 3 1.2.7 6.6 1.3 2.6 2.8 1.9 3.6 1 3.1 2.4 4.5 6.2 1.1 3.5-1.4 2.6-.2 3.4 1.9 2.3 4 1.9 1.5 3.1.4 6.7 4.1 1.4 8.5-1.2 3.8 1 1.5-7.4 3-1.4 5 5-.4 3.5-4.1 5.5-2.6 12.8 2.3 9-4.4 6.4-.7 4.7-3.3 4 9 13.8 1.7 5.7-.3 4-9.8 7.4-1.6 3.7 2.6 2.7 14.1 4.7 4.1 3.1.3 5-1 3.7 3 3 5.4.4 2 4.3.7 4.7 8.1 6.8 3 4.3 4 3.4 1.4 5.7 4.3-2.7 4.4 1.7 3.1 2.7 1.3.3 3 5.4 4.1-2h4.7l2.6-3.4 4.8-1.3 2.6 13.7 3.4 2.1-1.4 4 13.2 6.7 8-1.7 5.1 2.1 3.7 4 5.4-1 3.6 2.3 3.4-.6 3.7 4.7 9.8 5.3 1.6 5.8 5.1 1.3 2.7 4.4-2.4 3.7-9 5-.7 5.4 1.3 4.4-6.7 7 .3 4.1-2.7 2.7-14.8 2.7-1.3 4 9.7 10.4.7 3 25.9 13.1 1 9.1-34.6 7.8-3.7 3-2.7 4 .1 7 3.3.7 3 5.8 25.9 9 10.4.7 4.4 2.7 2.7 4 1.3 17.8 2.3 4.4 5.1 2.7 45.7 4.4 5.1 2.3 5.3.4 9.8 3.7 5.7-.4 3.7 3.4 5 10.4.4 9.7 2.3 4.1 4.1 3.3 2 3.7.7 6.4 3.3 3.4.3.7 13.2 3 4.7-1.3 18.8-35.7-.3-4.3 4-3.1 3-4 1.7-4.7 8.7-4.7 5.7-.4 5.1-2.3 6.7-6.7 5.7 1.3 29.3 27.3 17.1 2.6 14.5 18.8-1.4 4.4-9.7 3.4-5.7-.3-10.1-7.1-10.8-1.7-3.3 3.7-1.7 11.4-3.4 3.7-16.1 1.1-1.7 4 1 4.4 6.7 7 .4 14.1 11.1 17.9 3.7 3.3 16.1 4.7 5.7 3.7.7 1.1v4.1l-2.4 6.6.5 4.3 2.6 3.3 8.6 2.4 41.1 30.2 20.9 5.2 2.6 2.1.5 3.4-5 9.7-26.6 11.2-2.6 2.2-4.1 14.7-3.8 5.7-2.3 7.1 2.3 8.1 3.8 5.7 32.8 13.3 11 1.2 35.9-14.7 16.4-.5 4 1.7 16.9-.8 6.4 2.2.7.8 34.3 14.1 12.9-2.2 105.8 35.8 23.3-5.4 10 1 31.4-16.7 24.4 5.4 19.7 14.1 55.3-8.2 28.1 11.3 11.7-3.1 52.8 20.3 5-1.3 9.2-5.2 9.1-2 9 .6 5.8-2.4 3.9-4.2 13.4-5.6 8.8-.5 88.5-84.5 54-17.5 4.5 1 74.5-15.8 15.5-10.5 35.9-8.3 41.6 6.2 7.6-1.8 2.6-1.9 1.8 4.1.3 2.7-.8 3.5 2 3 3 2.3 7.5 2 13.5 14.5h4.3l7.5-2.8 28.5 1.3 3.5-1 4.7-5.5 3.5-1.5 6 5.2 5.8 16.8 7.7 2 18.5-2.3 16.5-11 4-1 16 45.3 46.8 21.7 27.7.8 17.5 5.2 31.5-2.7.9-.5-.1-24.5 3.5-8 1-12.8 4.2-6.5.5-8.7 6.3-13-11.3-45.8 3.3-1.7 1.7-2-2.2-12-4.3-5-4-15.8 5-14.2 3.5-3.8 5.3-2.5 52-75 .5-3.5 1.6-3.5-9.4 13.5-3.7 1-2.3 2.3-3 1.5-1.2 3.7-6.8 4.8-3.7 6.5-1.5 7-2.8 3-1.5-2.8 2.8-19.7-3.8-.8-4.2 6-1 3.5v8.5l-2-1.5-.8-4.2-2.7-3.3-1.3-3.5 2.5-1.5 3.3 1 .7-7.2 3.3-1.8 2.2 3 4.5-4.5-.2-1.2-3.3-.3.3-6.5-2.3-3 2.8-2.2 3.7-1 2.3.7-3.3 3.5 1 2.8 23.5-23.3 4-.7 4 1.7 4.8-3.2.2-1.2-1.7-1.6-3.8.3-10.5-4.5-3.5.5 3.3 1 2.5 2.7-.5 3.3-18.3 13.2-3.2-1.5-2.3-2.5-1-3.5 1-2.7 3-2.8-1.5-2-4-.5-.5-1.5.5-2-4.5.3-3.7-1-1.3 3.7-2.2.5-.5-3.5.7-3-2.2-4 3 .5 3 3.5 4 1.5 3.2-1 .8-4.2 6.2 1.2 13-8.5h8l5-1.5-5.2-6v-3.5l3.5-1.5 1.7-2.7-4.7-.5.2-3 4.3-1 2-2.5-19-15.3-1-3.7 1-3.3-1.5-3.5.5-3.7-.8-4 .5-3.5 13.3-7.8 3.2-.5 2.8-1.7 1.5-4.3-.5-3.5 4.5-.2 1.7 1.7 2.8 1.3 4-.5 15.2 7.5-1.5 2.5-.2 3.2-7.8 2.5-3 2.5-1.5 3.3-.2 4 4 18 5 7 2.2-2 4.5-1.5V973l-3.2-2.5-1-4.8 3-.5 11.2 13.8-2.5 7.7-20.5 13.5-11.7 3.5 6.7 14.8 2.3 1 22-24.5 85.7-18.8 9.5-8-1 6 3-2 1-6.5-3-5 4-5 6-72 5-6.5-1-2.5z"
  })));
};

RomaniaMap.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1923.3 1350.6"
};

var WorldMap = function WorldMap(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    fill: "#FFDC01"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M128.1 3.9l-1.8-1.4-4.9 2.1 4.3.8zM421.1 64.6l.9-1.3h2.9l1.3-2.1-6.6-2.8.2 5.4zM411.5 44.8h-2l5.5 6.8 2.7 4.9h2l-3.3-4.7h1.9zM426.1 69.6l-2-3.4-1.9-.6 1.1 5.2-4 3.6-5.4 1.4-.5 1.7 6.5-1 .5 2.5 1.4-.6.2-2 4.3-1.1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M419 77.9l-2.7.4 1.5 1.7zM414.5 153.9l3-.4v-1.1h-4.1l-2.5 2.7 1.9.3zM422.7 142.3H419l-.5 1.5 4.2-.5zM419.5 134.8l1.1-1.4-.7-.9-1.4 1.4-.5 3.4 1.9.5zM134.1 28.3v-4.7l3.6 1.3 2.1-1.4-1.2-2.1-2.1-.8-.1-3.3-11.5-4.7h-1.7l-4.1 3.3 1.4-3.4h-2l-4.6 5 11.3-.6 7 6.2-4.7-.1-2.4 1.9h-5.2v1.5h5.3l4.6 3.8 1.2-.5-1.1-2.4 3.2 1.5zM216.1 68.7h2.2v-1.8zM428.9 138.7l-4.6.6 5.1 2.4zM401.6 96.2l2.1 2 1.3-3.7-1.3-1.4zM210.2 43.5l-1.7.9 1.5 2.2-3 2.9 4-.8 4.1-.6.2-1.5h.8l.2-1.7-2.6-.5-3.3-7.6-2.5-.1v4.1l2.3.2zM130.9 9.5h-8.4l-2.8-1.2-2.8 2.4 11.1.9zM201.1 43.2v4.4h1.7v-1.5l3.2.4-.2-3.2 1.2-.5v-1.6l-2.9-.2zM139.5 53.7l-2-3.2h-.1l-1.7-.4V47.8l-5.8 5.8h.1v.1zM129.9 7.5h-6l.9.8h6.5l1.1.9 9.5-4.4 7.6-1.5 5.8-3.3-23 1.7V3l7.8-.2-1.1 1.4-8.1.2 1.1 1.9-3.5-.6zM404.2 154.5l.8.9h1.7l-.6-1.3zM382.4 150.3l16.1 2.7-.2-1.1-5.8-2.8-3.7.8-4-1.6zM403.1 138.4v-12.2l-2.9.2-3.4 4.6-8 3.7.1 4.3 2.5 4.3h7.8zM385.6 104.6l1.1 1.3 1.5-1.9v-1.5l-2.6.6zM409.9 152.7l-1.3-.8h-2.5l.5 1.6h2.3zM407.9 139.3l-.7-1.1 1.5-1.7 2.7 1 1.4-.1 2.1-2.4-1.8-.1-1.2.8-3.9-.9-2.5 2.3.1 3.6-1.5 2 1 4.8 1.8-.6-.5-3.3 1.1-1.2.9 2.4 2.2.8v-1.7l-1.3-2.8 2.4-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M440 142.5l-4.4-2.3-4.2 3.3-4.4-1.7-.5 2.4 2.6-.1 6.4 2.7 1.2 3.3-2.2 1.3 5.5 1.9 2 .7 3.8-3.5 5 4.8 4.5.9-5.6-5.5.3-3zM457.9 145.4l-5.4 2.8 2 1.2 3.4-1.9zM407.1 105.2l-2.4-.1-.6 5 3.4 4 3.8.5.6-1.6-3.6-.4-1.3-1.6 1.3-3zM413.8 118.3h1.7l-1.7-2.7-1.7.6zM411 120.9l-.8-1.3-.9 1.1.9 1.2zM415.8 79.9l-.7-1.2-2.4.3 2.3 3.5zM405 117.9l-4.3 3.9 1.6.3 2.8-2.3zM411 118.6l1.3 2 .8-1-1-1.6zM414.8 120l-1.2 3.1h-3.9l3.3 2.3v2.2l2.3-.7-.8-1.4 1.9-.5zM410.2 117.1l-1.7-.2-.8 1.4 1.2.8zM405.9 115.6l1.3 1.3.5-1-1.6-1.6zM194.2 24l-3.7-.1-.8 1.1-2.2-.1V27l7.6 1 4.5-2.2v-.6l-2.2-2.3zM383.2 146v-3.3l-12.9-13.4-4.4-1.7 14.9 20.4zM283 168.3l-.8 5.8-1.4 3.9 1.7 4 4.1.2 6.9-22.2H291zM140 142.2l.2-2.2-3.7-1.6-3.7 2.2 1.2-3.3-2.5-1.1-3.5 2.7 2.5-3.8-2.2-4.9-1.3-2.8-2.7-.2-4.8-.4-5.1-4.9-1.7-1.6-6.5-.6-3.7-2.6-8.5-.1h-1.7l-3.6 4.9-1.8.1-.5-1.9-3.9.3-1.4 1.1-1.8-1-1-.6v-2.4l-.2-8.4-8 .1.5-1 2.6-4.8.1-.1.1-3.4H70l-2.7 4.5h-7.5L56 96.5l3-3.8 7.1-8.9 16.8.1 1.1 8.4 2.7.1.1-10.4L114 58.8l1.8-.3v-.1l5.1-.9-3.4 1.6.3 1.4 9.2-3.2-4.5-.2-2.1-1.9 2.1-3.2-1-1-6.5 2.9v-1.7l6.2-3 9.9-.4 7.5-4V43l-5.5-.9-.7-8.9-7.1 2.8v-4.2l-3.4-2.9h-4.7l-12.6 18.4h-3.1l.1-6-10.9-5.9 10.9-8.1 6.2-1.1-1.3-1.9 9.5-1 3.9-4-3.6-.4-5 3.3.6-2.8-2.3-.2-.6-3.4-4 1.8 1 2.2-5.4 2.6-9.4-1.8-5 2.3-12.1-4.8-23.1.5-3.7-1.5-19.1.1-7.7 3.1v3.4l-8.7-.1-1.6 2.3 7.3-.3L8.2 29l-4.6 6.2 3.9-.1L0 40l2.7.2 14.4-6.9 16.6-.6 5 5-1.9 8.8 3.5 3.1v1.7h.4-.4L27.5 65v10.4l4.7 4.7.7 7.3 5 9.5 2.1-1.6-4-8.4v-4.8h2.3l.1 4.4 7.5 17.6 12.2 5.1 3.1-.8 2.6 2.7 3.9 2 2.8 1.3.7.3 2.5 3.4 2.9 3.9 1 .4 4.3 1.5 1-1.6 2.5.2.7 2.4.7 2.5-.7 4.6-2.1 2.6-3.1 3.9-.4 5.9-.1 1.8 10.8 18.4 9.3 6.2 1.6 38.2 4.1 3.3.2 6.9 7.2 9.3 2.3.2 1.9.2-1-20.1 10.9-4.7-4.9-6.9 5.9 2.2 2.4-4.1 4.8-8.4 1.1-7.2 11.7-5.2 2.2-16.1 5-6.6v-4l-8.2-5.4-7.7-.2zM83.6 53.6l7.8-1.6 1 3.4 1.6 1.2 2.6-.2 1 3.1h.1-1.6L94 61.1l-2.2.2.4-3.7h-1.7l-1.9 1.3-3.6 5.3h-2.1l4.1-6.6 4.8-1-.3-.9-3.2-.1-1.5-.9-1.8.9h-2.2l.8-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M369.1 110.5l1.3 4.9-.3 5-.1 2 3.5 3 .3 1.1 2.1-.3-3.4-5.1.8-7.8 3.9 3.8 1.9 1.9 2.2-.3.1 3.5 6.2-4.1-.2-6.1-6.5-6.8.3-3.7 2.3-1.3 2.1-1.2.1 2 12.5-4.5 4.1-9.1-7.3-12 3.7-4.1h-4.3l-1.4.9-2.7-4.4 3.4-3 2.4 4.5 3.3-2.3 1.9 3.5 2.5.7 2.6 5.6 3.1-.2.5-3.6-4.3-3.5-1.9-1.6 2.5-.3-.4-4.9 4.6-.8 2.5-3.7v-6.9l-7.1-8.1-6.9-.1 1.2-8.5 14.2.1 1.5-4.8 6 2.3V30l1.5.2 2.6 2.5-2.5 1.7-.3 5.1 10.1 9.6v-9.2l-5.7-5.5 13.5-4.3.2-1.4-6.8-1.8 2.6-2.1 6.1 1.3 4.1.1-3.3-3.5-21.2-4.2-32.8-1.2-1.8-2.5-11.4-1.9-3.2 2.9h-9.3l-3.9-2.9h-20.9l-1.3-4.6h-19.3l-17 7.6 3.7 4.6-3.2 3.3-2.9-9.5-5.1-.4 2.5 5.6-19.9.5-18.6 7.6-2.5-4.7 7.1.3 3.4-1.7-13.5-4.3-2.9.1-2.9.1-5.7.3-19.7 13.6 2 4.6 5.9-1 .4.5 3.8 4.4 6.2-5.5-2.9-3.6 6.5-7.1h2.3l-3.1 7.1 3.7 1.9h5.6l-.8.7-.9.8-4.6.1-.4 1 1.4 1 .3.2-.3 1.5-3.2-1.5V42.1l-3.2.1-.7-.7-4.6 1.1h-.4l-5.9-.1-.3-1.1-.1-.4.7-3.8h-1.9l-1.3 3 .5 1.3.4 1-3.1 1.9-3.1 1.9-1.8 1.1-7.7 4.6H208v1.2l3.3 1.8.4 5.9-11.3.1-.1 2.2-.2 6.4 1.6 2.8.9.1 7 .5 5.4-6.9 1.2-1.5.4-.6 1.5-2 7.2.1.2-3H228.3l8 8 .4 3.4 1.5-.9.5-2.4 1.8-.4-9.8-8.4 2.8-.2h1.1l3.4 3.9.7.2 1.1.3 2.2 4.2.2.3 1.4 1.6 2.7.8-1.7.7 2.2 2.8 1.4-2.2-1.5-3.4 3.1-1.5h5.6l-1.2-2.7 1-3 .8-2.5h.1l.4-1.2h5.8l-1.3 1.3 1.8 1 2.4-.2-2.3-2.9 6-1.3.7 1.7-1.8.5.3 2.8 6.4 2.2v3h-.1l-17.2.6-1.5 1.8h-3.3l2.7 5.5 12.6.7-.6 2.7-.6 2.7-1.1 4.1-14-1.9-5.9-.8-2.4 3.7-5.4-1.1-2.1-2.6-4.6-1.1-1.7-.4.2-5.8-5.1-.1-5.9-.2-7.9 3-9 .9-8.7 11.3-7.3 9.6-.1 2.3-.2 6.4.1.8-.1-.8-.2 6.2v1.4l-.1 2.4v.1l2.3 2.4 2.9 3.1 2.8 3 5.8 6.3 8.5-2.5 5.8-1.7 3-.8 4.7.7.6 2.9h6.1l-.1 3.6-.1 2.7-.1 4.3 3.6 4.8 1.8 2.4 1 1.3v11.7l-3 4.9.3 3.2 6.6 18.6h.1-.1l3.9 10.6h12.7l9.8-11.3.4-3 .1-.9 3.8-2.7-.3-8 8.9-7.3-.9-8.4-1.1-12 2.9-3.4 17.3-20.2-.7-3.5-12.1 1.8-.6-1.1-1.4-2.5-7-12-4.1-7.1-6.4-11 3.5 2.8 1-2.2v-.2h.3-.3l12.5 21.7.2.8 2.2 7.2 16.3-7.3 8.2-10.2-4.5-4-1.7-1.5-2.7 3-3.4-.7-1-.7.9-.9L293 91l-.7 2.2-.4-.3-3.5-5.8-1.8-2.9 1.5-.1.3.2 2.4.2 5.5 5.7 10.1 3H318l2.3 2.6.3.4 3.2 1-1.5 1.5 1.4 1.8 2.5.3.5-2.1h1l8.1 23.4 5.2-3.2.8-9.4 11.8-11.4 1.2-1.2 5.6 4.7 2.5 2.1 1 5 1.8.5 1.3-1.6 2.1 2.9zm-155.9 16.4l2.1-.6.9-.2-3 .8zM115 13.3l-1-1.3-4.6 1 .4 1.7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M230.6 39.2l-1.1.4-.3 1.6h1.9l.6-.9zM197.6 4.9l5.4-1.1 1.8-1.8L189.5.4 176.2 2h-16.1l-9.3 3.2-7.4 2.2v2.3l11.3.1 2.9 5v4.5l-5.4 3.1.2 6.1 3.4 3.5h4l6.1-6.5 8.7-2.6 3.2-2.5 6.6-.4 4.6-1.3zM235.7 70.3h-3.9v1l1.5 1 2.4.3zM233.1 75.4l2.4.6v-2.2h-2.4zM261.6 76l2.5.7 1.1-2zM227.8 62.1h-1.3v1.7l.9.3zM225.6 68.8h1.8v-3.4l-1.8-.5zM373.9 126.4l1.4 4.5 5.6 4.8.5-1.7-5.4-7.9zM114.4 28l.6-1.6-3.5-1.5-3 2.4zM38.6 50.3L36 48.1l-1.1 1 1.8 2.4h1.9zM86.1 12.4l-2.3-1-9.5 2.4 1.8 2.1zM107.7 14.6l1-2.6-6.5 2.1 1.7 1.8zM103.9 18.8l-.8-1.3-3 1.3 1.1 1.4zM85.2 16.3l-5 1.2 6.2 2.4 4.3-1.8 4.7 1.1 3.6-.8-3.5-1.6 2.7-3.5h-2.7l-1.6 2.1-.6-2.1-2.9 1.1-3-1.3-5.4 1.8zM85.6 96.3h-4.3l-1.7 1.6h4.9l4 2.7-1.5 1.6h6.9zM117.5 231.8l2.2 2 6.8.3-7.4-3.8zM105.9 105.5l.6-1h-1.7l-.6 1zM455.3 142.5l4 2.9 1.6-.5-4.1-2.5zM86.5 105.3l1 .9h3v-1.1l-1-1h-3zM99.3 104.1h2.6l.7-1-4.9-.5h-3l1 1.4h-1.8v.6h3.8v.7zM468.2 203.3v-3.2l-1.2.5v4.5l-3 3-1 3.2 7.3-5.2zM448.3 220.6l11.7-7.7v-2l-15.2 7.7zM433 159.3l-2.2-.7v6.7l-4.8 4.8-7.2-6.2 2.2-4-8.7.2-2.3 4.8-5.2-2.3-9.5 10.5-12.8 6v14.2l-2 4.8 1.5 1.8 24.3-5.3 4 3.5 4.2-1.8 1.5 8.3 12.3.7 14.2-14.7.8-8.3-7.8-11z"
  })));
};

WorldMap.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 470.3 234.1"
};
var defaultAspectRatio = 21 / 15;
var defaultDiasporaAspectRatio = 38 / 25;
var defaultMaxHeight = 460;
var ElectionMap = themable("ElectionMap", cssClasses$8)((_ref) => {
  var classes = _ref.classes,
      scope = _ref.scope,
      onScopeChange = _ref.onScopeChange,
      involvesDiaspora = _ref.involvesDiaspora,
      aspectRatio = _ref.aspectRatio,
      _ref$maxHeight = _ref.maxHeight,
      maxHeight = _ref$maxHeight === void 0 ? defaultMaxHeight : _ref$maxHeight,
      children = _ref.children;

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      ref = _useDimensions2[0],
      _useDimensions2$1$wid = _useDimensions2[1].width,
      width = _useDimensions2$1$wid === void 0 ? 0 : _useDimensions2$1$wid;

  var showsSimpleMap = scope.type === "national";
  var ar = aspectRatio !== null && aspectRatio !== void 0 ? aspectRatio : showsSimpleMap && involvesDiaspora ? defaultDiasporaAspectRatio : defaultAspectRatio;
  var height = Math.min(maxHeight, width / ar);

  if (!Number.isFinite(height)) {
    height = 0;
  }

  var _useMemo = useMemo(() => {
    if (scope.type === "locality" && scope.countyId != null) {
      var _scope$localityId;

      return ["".concat(electionMapOverlayUrl, "/localities_").concat(scope.countyId, ".geojson"), (_scope$localityId = scope.localityId) !== null && _scope$localityId !== void 0 ? _scope$localityId : null, localityId => _objectSpread$2(_objectSpread$2({}, scope), {}, {
        localityId
      })];
    }

    if (scope.type === "locality" && scope.countyId == null || scope.type === "county") {
      var _scope$countyId;

      return ["".concat(electionMapOverlayUrl, "/counties.geojson"), (_scope$countyId = scope.countyId) !== null && _scope$countyId !== void 0 ? _scope$countyId : null, countyId => _objectSpread$2(_objectSpread$2({}, scope), {}, {
        countyId
      })];
    }

    if (scope.type === "diaspora" || scope.type === "diaspora_country") {
      return ["".concat(electionMapOverlayUrl, "/diaspora_countries.geojson"), scope.type === "diaspora_country" && scope.countryId != null ? scope.countryId : null, countryId => ({
        type: "diaspora_country",
        countryId
      })];
    }

    return ["".concat(electionMapOverlayUrl, "/dobrogea.geojson"), null, countyId => ({
      type: "county",
      countyId
    })];
  }, [scope]),
      _useMemo2 = _slicedToArray(_useMemo, 3),
      overlayUrl = _useMemo2[0],
      selectedFeature = _useMemo2[1],
      scopeModifier = _useMemo2[2];

  var onFeatureSelect = useMemo(() => onScopeChange && (featureId => {
    onScopeChange(scopeModifier(featureId));
  }), [onScopeChange, scopeModifier]);
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root,
    ref: ref,
    style: {
      height
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.container,
    style: {
      width,
      height
    }
  }, showsSimpleMap ? /*#__PURE__*/React.createElement("div", {
    className: classes.staticMap,
    style: {
      maxWidth: height * ar,
      fontSize: height * ar * 0.05
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.staticMapRomaniaContainer
  }, /*#__PURE__*/React.createElement(RomaniaMap, {
    className: classes.staticMapRomania
  }), children), involvesDiaspora && /*#__PURE__*/React.createElement("div", {
    className: classes.staticMapWorldContainer,
    style: {
      fontSize: Math.min(16, height * ar * 0.05)
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.staticMapWorldLabel
  }, "Diaspora"), /*#__PURE__*/React.createElement(WorldMap, {
    className: classes.staticMapWorld
  }))) : width > 0 && height > 0 && /*#__PURE__*/React.createElement(HereMap, {
    className: classes.hereMap,
    width: width,
    height: height,
    initialBounds: scope.type === "diaspora" || scope.type === "diaspora_country" ? worldMapBounds : romaniaMapBounds,
    overlayUrl: overlayUrl,
    selectedFeature: selectedFeature,
    onFeatureSelect: onFeatureSelect
  })));
});

var css_248z$a = ".ResultsTable-module_root__9__at{width:100%;font-size:1.125rem}.ResultsTable-module_root__9__at thead tr{background-color:#352245;color:#fff}.ResultsTable-module_root__9__at tbody tr{color:#414141}.ResultsTable-module_root__9__at tbody tr:nth-child(odd){background-color:#f1f1f1}.ResultsTable-module_root__9__at td,.ResultsTable-module_root__9__at th{padding:1rem;text-align:center}.ResultsTable-module_root__9__at td:not(:first-child),.ResultsTable-module_root__9__at th:not(:first-child){border-left:1px solid #fff}";
var cssClasses$a = {
  "root": "ResultsTable-module_root__9__at"
};
styleInject(css_248z$a);

var ResultsTable = themable("ResultsTable", cssClasses$a)(
/*#__PURE__*/
// eslint-disable-next-line react/display-name
forwardRef( // eslint-disable-next-line @typescript-eslint/no-unused-vars
(_ref, ref) => {
  var classes = _ref.classes,
      className = _ref.className,
      constants = _ref.constants,
      otherProps = _objectWithoutProperties(_ref, ["classes", "className", "constants"]);

  return /*#__PURE__*/React.createElement("table", Object.assign({
    className: classes.root
  }, otherProps, {
    ref: ref
  }));
}));

var ElectionTurnoutBars = themable("ElectionTurnoutBars")((_ref) => {
  var classes = _ref.classes,
      eligibleVoters = _ref.eligibleVoters,
      totalVotes = _ref.totalVotes;
  var theme = useTheme();
  var voterRatio = totalVotes / eligibleVoters;
  var items = [{
    color: theme.colors.primary,
    legendName: "Cetățeni cu drept de vot",
    value: 1,
    valueLabel: formatPercentage(1),
    legendNote: "(".concat(formatGroupedNumber(eligibleVoters), ")")
  }, {
    color: theme.colors.secondary,
    legendName: "Au votat",
    value: voterRatio,
    valueLabel: formatPercentage(voterRatio),
    legendNote: "(".concat(formatGroupedNumber(totalVotes), ")")
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement(PercentageBars, {
    total: 1,
    items: items
  }), /*#__PURE__*/React.createElement(PercentageBarsLegend, {
    items: items
  }));
});

var css_248z$b = ".ElectionTurnoutBreakdownChart-module_root__t1UBj{display:flex;flex-direction:column;align-items:stretch;max-width:21.25rem}.ElectionTurnoutBreakdownChart-module_chartRow__28bOm{display:flex;flex-direction:row;align-items:stretch}.ElectionTurnoutBreakdownChart-module_chartContainer__3UCxi{flex:1;height:100px;position:relative}.ElectionTurnoutBreakdownChart-module_chart__2kyp5{position:absolute;top:0;left:0}.ElectionTurnoutBreakdownChart-module_infoRow__ZFBTZ{width:6.25rem;flex-grow:0;flex-shrink:0;margin-right:.5rem;display:flex;flex-direction:column;align-items:center}.ElectionTurnoutBreakdownChart-module_typeLabel__3_Quj{font-size:1.25rem;font-weight:600;color:#e7e7e7;line-height:1.5;margin-bottom:.25rem}.ElectionTurnoutBreakdownChart-module_mapIconContainer__sYzLp{flex:1;align-self:stretch;display:flex;align-items:flex-start;justify-content:center}.ElectionTurnoutBreakdownChart-module_worldMapIcon__2dQbG{width:100%}.ElectionTurnoutBreakdownChart-module_romaniaMapIcon__11irL{width:93%}";
var cssClasses$b = {
  "root": "ElectionTurnoutBreakdownChart-module_root__t1UBj",
  "chartRow": "ElectionTurnoutBreakdownChart-module_chartRow__28bOm",
  "chartContainer": "ElectionTurnoutBreakdownChart-module_chartContainer__3UCxi",
  "chart": "ElectionTurnoutBreakdownChart-module_chart__2kyp5",
  "infoRow": "ElectionTurnoutBreakdownChart-module_infoRow__ZFBTZ",
  "typeLabel": "ElectionTurnoutBreakdownChart-module_typeLabel__3_Quj",
  "mapIconContainer": "ElectionTurnoutBreakdownChart-module_mapIconContainer__sYzLp",
  "worldMapIcon": "ElectionTurnoutBreakdownChart-module_worldMapIcon__2dQbG",
  "romaniaMapIcon": "ElectionTurnoutBreakdownChart-module_romaniaMapIcon__11irL"
};
styleInject(css_248z$b);

var WorldMap$1 = function WorldMap(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    fill: "#FFDC01"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M128.1 3.9l-1.8-1.4-4.9 2.1 4.3.8zM421.1 64.6l.9-1.3h2.9l1.3-2.1-6.6-2.8.2 5.4zM411.5 44.8h-2l5.5 6.8 2.7 4.9h2l-3.3-4.7h1.9zM426.1 69.6l-2-3.4-1.9-.6 1.1 5.2-4 3.6-5.4 1.4-.5 1.7 6.5-1 .5 2.5 1.4-.6.2-2 4.3-1.1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M419 77.9l-2.7.4 1.5 1.7zM414.5 153.9l3-.4v-1.1h-4.1l-2.5 2.7 1.9.3zM422.7 142.3H419l-.5 1.5 4.2-.5zM419.5 134.8l1.1-1.4-.7-.9-1.4 1.4-.5 3.4 1.9.5zM134.1 28.3v-4.7l3.6 1.3 2.1-1.4-1.2-2.1-2.1-.8-.1-3.3-11.5-4.7h-1.7l-4.1 3.3 1.4-3.4h-2l-4.6 5 11.3-.6 7 6.2-4.7-.1-2.4 1.9h-5.2v1.5h5.3l4.6 3.8 1.2-.5-1.1-2.4 3.2 1.5zM216.1 68.7h2.2v-1.8zM428.9 138.7l-4.6.6 5.1 2.4zM401.6 96.2l2.1 2 1.3-3.7-1.3-1.4zM210.2 43.5l-1.7.9 1.5 2.2-3 2.9 4-.8 4.1-.6.2-1.5h.8l.2-1.7-2.6-.5-3.3-7.6-2.5-.1v4.1l2.3.2zM130.9 9.5h-8.4l-2.8-1.2-2.8 2.4 11.1.9zM201.1 43.2v4.4h1.7v-1.5l3.2.4-.2-3.2 1.2-.5v-1.6l-2.9-.2zM139.5 53.7l-2-3.2h-.1l-1.7-.4V47.8l-5.8 5.8h.1v.1zM129.9 7.5h-6l.9.8h6.5l1.1.9 9.5-4.4 7.6-1.5 5.8-3.3-23 1.7V3l7.8-.2-1.1 1.4-8.1.2 1.1 1.9-3.5-.6zM404.2 154.5l.8.9h1.7l-.6-1.3zM382.4 150.3l16.1 2.7-.2-1.1-5.8-2.8-3.7.8-4-1.6zM403.1 138.4v-12.2l-2.9.2-3.4 4.6-8 3.7.1 4.3 2.5 4.3h7.8zM385.6 104.6l1.1 1.3 1.5-1.9v-1.5l-2.6.6zM409.9 152.7l-1.3-.8h-2.5l.5 1.6h2.3zM407.9 139.3l-.7-1.1 1.5-1.7 2.7 1 1.4-.1 2.1-2.4-1.8-.1-1.2.8-3.9-.9-2.5 2.3.1 3.6-1.5 2 1 4.8 1.8-.6-.5-3.3 1.1-1.2.9 2.4 2.2.8v-1.7l-1.3-2.8 2.4-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M440 142.5l-4.4-2.3-4.2 3.3-4.4-1.7-.5 2.4 2.6-.1 6.4 2.7 1.2 3.3-2.2 1.3 5.5 1.9 2 .7 3.8-3.5 5 4.8 4.5.9-5.6-5.5.3-3zM457.9 145.4l-5.4 2.8 2 1.2 3.4-1.9zM407.1 105.2l-2.4-.1-.6 5 3.4 4 3.8.5.6-1.6-3.6-.4-1.3-1.6 1.3-3zM413.8 118.3h1.7l-1.7-2.7-1.7.6zM411 120.9l-.8-1.3-.9 1.1.9 1.2zM415.8 79.9l-.7-1.2-2.4.3 2.3 3.5zM405 117.9l-4.3 3.9 1.6.3 2.8-2.3zM411 118.6l1.3 2 .8-1-1-1.6zM414.8 120l-1.2 3.1h-3.9l3.3 2.3v2.2l2.3-.7-.8-1.4 1.9-.5zM410.2 117.1l-1.7-.2-.8 1.4 1.2.8zM405.9 115.6l1.3 1.3.5-1-1.6-1.6zM194.2 24l-3.7-.1-.8 1.1-2.2-.1V27l7.6 1 4.5-2.2v-.6l-2.2-2.3zM383.2 146v-3.3l-12.9-13.4-4.4-1.7 14.9 20.4zM283 168.3l-.8 5.8-1.4 3.9 1.7 4 4.1.2 6.9-22.2H291zM140 142.2l.2-2.2-3.7-1.6-3.7 2.2 1.2-3.3-2.5-1.1-3.5 2.7 2.5-3.8-2.2-4.9-1.3-2.8-2.7-.2-4.8-.4-5.1-4.9-1.7-1.6-6.5-.6-3.7-2.6-8.5-.1h-1.7l-3.6 4.9-1.8.1-.5-1.9-3.9.3-1.4 1.1-1.8-1-1-.6v-2.4l-.2-8.4-8 .1.5-1 2.6-4.8.1-.1.1-3.4H70l-2.7 4.5h-7.5L56 96.5l3-3.8 7.1-8.9 16.8.1 1.1 8.4 2.7.1.1-10.4L114 58.8l1.8-.3v-.1l5.1-.9-3.4 1.6.3 1.4 9.2-3.2-4.5-.2-2.1-1.9 2.1-3.2-1-1-6.5 2.9v-1.7l6.2-3 9.9-.4 7.5-4V43l-5.5-.9-.7-8.9-7.1 2.8v-4.2l-3.4-2.9h-4.7l-12.6 18.4h-3.1l.1-6-10.9-5.9 10.9-8.1 6.2-1.1-1.3-1.9 9.5-1 3.9-4-3.6-.4-5 3.3.6-2.8-2.3-.2-.6-3.4-4 1.8 1 2.2-5.4 2.6-9.4-1.8-5 2.3-12.1-4.8-23.1.5-3.7-1.5-19.1.1-7.7 3.1v3.4l-8.7-.1-1.6 2.3 7.3-.3L8.2 29l-4.6 6.2 3.9-.1L0 40l2.7.2 14.4-6.9 16.6-.6 5 5-1.9 8.8 3.5 3.1v1.7h.4-.4L27.5 65v10.4l4.7 4.7.7 7.3 5 9.5 2.1-1.6-4-8.4v-4.8h2.3l.1 4.4 7.5 17.6 12.2 5.1 3.1-.8 2.6 2.7 3.9 2 2.8 1.3.7.3 2.5 3.4 2.9 3.9 1 .4 4.3 1.5 1-1.6 2.5.2.7 2.4.7 2.5-.7 4.6-2.1 2.6-3.1 3.9-.4 5.9-.1 1.8 10.8 18.4 9.3 6.2 1.6 38.2 4.1 3.3.2 6.9 7.2 9.3 2.3.2 1.9.2-1-20.1 10.9-4.7-4.9-6.9 5.9 2.2 2.4-4.1 4.8-8.4 1.1-7.2 11.7-5.2 2.2-16.1 5-6.6v-4l-8.2-5.4-7.7-.2zM83.6 53.6l7.8-1.6 1 3.4 1.6 1.2 2.6-.2 1 3.1h.1-1.6L94 61.1l-2.2.2.4-3.7h-1.7l-1.9 1.3-3.6 5.3h-2.1l4.1-6.6 4.8-1-.3-.9-3.2-.1-1.5-.9-1.8.9h-2.2l.8-2z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M369.1 110.5l1.3 4.9-.3 5-.1 2 3.5 3 .3 1.1 2.1-.3-3.4-5.1.8-7.8 3.9 3.8 1.9 1.9 2.2-.3.1 3.5 6.2-4.1-.2-6.1-6.5-6.8.3-3.7 2.3-1.3 2.1-1.2.1 2 12.5-4.5 4.1-9.1-7.3-12 3.7-4.1h-4.3l-1.4.9-2.7-4.4 3.4-3 2.4 4.5 3.3-2.3 1.9 3.5 2.5.7 2.6 5.6 3.1-.2.5-3.6-4.3-3.5-1.9-1.6 2.5-.3-.4-4.9 4.6-.8 2.5-3.7v-6.9l-7.1-8.1-6.9-.1 1.2-8.5 14.2.1 1.5-4.8 6 2.3V30l1.5.2 2.6 2.5-2.5 1.7-.3 5.1 10.1 9.6v-9.2l-5.7-5.5 13.5-4.3.2-1.4-6.8-1.8 2.6-2.1 6.1 1.3 4.1.1-3.3-3.5-21.2-4.2-32.8-1.2-1.8-2.5-11.4-1.9-3.2 2.9h-9.3l-3.9-2.9h-20.9l-1.3-4.6h-19.3l-17 7.6 3.7 4.6-3.2 3.3-2.9-9.5-5.1-.4 2.5 5.6-19.9.5-18.6 7.6-2.5-4.7 7.1.3 3.4-1.7-13.5-4.3-2.9.1-2.9.1-5.7.3-19.7 13.6 2 4.6 5.9-1 .4.5 3.8 4.4 6.2-5.5-2.9-3.6 6.5-7.1h2.3l-3.1 7.1 3.7 1.9h5.6l-.8.7-.9.8-4.6.1-.4 1 1.4 1 .3.2-.3 1.5-3.2-1.5V42.1l-3.2.1-.7-.7-4.6 1.1h-.4l-5.9-.1-.3-1.1-.1-.4.7-3.8h-1.9l-1.3 3 .5 1.3.4 1-3.1 1.9-3.1 1.9-1.8 1.1-7.7 4.6H208v1.2l3.3 1.8.4 5.9-11.3.1-.1 2.2-.2 6.4 1.6 2.8.9.1 7 .5 5.4-6.9 1.2-1.5.4-.6 1.5-2 7.2.1.2-3H228.3l8 8 .4 3.4 1.5-.9.5-2.4 1.8-.4-9.8-8.4 2.8-.2h1.1l3.4 3.9.7.2 1.1.3 2.2 4.2.2.3 1.4 1.6 2.7.8-1.7.7 2.2 2.8 1.4-2.2-1.5-3.4 3.1-1.5h5.6l-1.2-2.7 1-3 .8-2.5h.1l.4-1.2h5.8l-1.3 1.3 1.8 1 2.4-.2-2.3-2.9 6-1.3.7 1.7-1.8.5.3 2.8 6.4 2.2v3h-.1l-17.2.6-1.5 1.8h-3.3l2.7 5.5 12.6.7-.6 2.7-.6 2.7-1.1 4.1-14-1.9-5.9-.8-2.4 3.7-5.4-1.1-2.1-2.6-4.6-1.1-1.7-.4.2-5.8-5.1-.1-5.9-.2-7.9 3-9 .9-8.7 11.3-7.3 9.6-.1 2.3-.2 6.4.1.8-.1-.8-.2 6.2v1.4l-.1 2.4v.1l2.3 2.4 2.9 3.1 2.8 3 5.8 6.3 8.5-2.5 5.8-1.7 3-.8 4.7.7.6 2.9h6.1l-.1 3.6-.1 2.7-.1 4.3 3.6 4.8 1.8 2.4 1 1.3v11.7l-3 4.9.3 3.2 6.6 18.6h.1-.1l3.9 10.6h12.7l9.8-11.3.4-3 .1-.9 3.8-2.7-.3-8 8.9-7.3-.9-8.4-1.1-12 2.9-3.4 17.3-20.2-.7-3.5-12.1 1.8-.6-1.1-1.4-2.5-7-12-4.1-7.1-6.4-11 3.5 2.8 1-2.2v-.2h.3-.3l12.5 21.7.2.8 2.2 7.2 16.3-7.3 8.2-10.2-4.5-4-1.7-1.5-2.7 3-3.4-.7-1-.7.9-.9L293 91l-.7 2.2-.4-.3-3.5-5.8-1.8-2.9 1.5-.1.3.2 2.4.2 5.5 5.7 10.1 3H318l2.3 2.6.3.4 3.2 1-1.5 1.5 1.4 1.8 2.5.3.5-2.1h1l8.1 23.4 5.2-3.2.8-9.4 11.8-11.4 1.2-1.2 5.6 4.7 2.5 2.1 1 5 1.8.5 1.3-1.6 2.1 2.9zm-155.9 16.4l2.1-.6.9-.2-3 .8zM115 13.3l-1-1.3-4.6 1 .4 1.7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M230.6 39.2l-1.1.4-.3 1.6h1.9l.6-.9zM197.6 4.9l5.4-1.1 1.8-1.8L189.5.4 176.2 2h-16.1l-9.3 3.2-7.4 2.2v2.3l11.3.1 2.9 5v4.5l-5.4 3.1.2 6.1 3.4 3.5h4l6.1-6.5 8.7-2.6 3.2-2.5 6.6-.4 4.6-1.3zM235.7 70.3h-3.9v1l1.5 1 2.4.3zM233.1 75.4l2.4.6v-2.2h-2.4zM261.6 76l2.5.7 1.1-2zM227.8 62.1h-1.3v1.7l.9.3zM225.6 68.8h1.8v-3.4l-1.8-.5zM373.9 126.4l1.4 4.5 5.6 4.8.5-1.7-5.4-7.9zM114.4 28l.6-1.6-3.5-1.5-3 2.4zM38.6 50.3L36 48.1l-1.1 1 1.8 2.4h1.9zM86.1 12.4l-2.3-1-9.5 2.4 1.8 2.1zM107.7 14.6l1-2.6-6.5 2.1 1.7 1.8zM103.9 18.8l-.8-1.3-3 1.3 1.1 1.4zM85.2 16.3l-5 1.2 6.2 2.4 4.3-1.8 4.7 1.1 3.6-.8-3.5-1.6 2.7-3.5h-2.7l-1.6 2.1-.6-2.1-2.9 1.1-3-1.3-5.4 1.8zM85.6 96.3h-4.3l-1.7 1.6h4.9l4 2.7-1.5 1.6h6.9zM117.5 231.8l2.2 2 6.8.3-7.4-3.8zM105.9 105.5l.6-1h-1.7l-.6 1zM455.3 142.5l4 2.9 1.6-.5-4.1-2.5zM86.5 105.3l1 .9h3v-1.1l-1-1h-3zM99.3 104.1h2.6l.7-1-4.9-.5h-3l1 1.4h-1.8v.6h3.8v.7zM468.2 203.3v-3.2l-1.2.5v4.5l-3 3-1 3.2 7.3-5.2zM448.3 220.6l11.7-7.7v-2l-15.2 7.7zM433 159.3l-2.2-.7v6.7l-4.8 4.8-7.2-6.2 2.2-4-8.7.2-2.3 4.8-5.2-2.3-9.5 10.5-12.8 6v14.2l-2 4.8 1.5 1.8 24.3-5.3 4 3.5 4.2-1.8 1.5 8.3 12.3.7 14.2-14.7.8-8.3-7.8-11z"
  })));
};

WorldMap$1.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 470.3 234.1"
};

var RomaniaMap$1 = function RomaniaMap(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    fill: "#FFDC01"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1786.8 1022.2l-1.2 3.3-2.5 3.2-4.3 10.8 9.5-16-1.5-1.3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M1922.3 874.7l-5.5 1-5.5-4.5-3-6.5 5-4 5.2 1.2-1.8-18-9.1-21.7-14.8-13-35-11.7-19.2 1.5-2 2.5-3.8 1.5-4.5-1.3-4.2.3-20.8 16.7-18.2 4.5-17.3 12.8-2 3.2.3 4.5-2 4.3-23.8-14.3-4-.2-3.5 2 4 7 .5 3.7-9.2 2.5-1.5 3.3 2.5 3.2 4 2.8 1 3.7-22.8 6.3-10.2-4.5-15-.8-43.3-21.5-16.5-34-7.5-4.7-4.2-1.3-4.1.6-3.8-7.6-3.1-2.6-6-20.7-6.2-5-.9-4.1 2.1-3 3.8.4 3.1-1.6.5-3.4 1.4-3.3 1.2-11.9-1.6-3.3.7-11.2-2.4-2.8-1.2-2.9-.9-7.6-5.8-2.6-1.2-2.6.3-3.6-2.4-3.3-.2-10.7 2.1-2.6 1.2-3.1-1-2.6-.2-3.1 1.2-3.6-8.8-29.9v-3.8l2.2-7.2-1.5-3.3-.2-3.5 2.1-3.4v-3.8l3.8-5.9.3-3.4-.8-3 2.9-11-6.2-14.2.3-4.3 2.6-2.2 1.4-6.6 4-4.5 5.5-3.6 1.9-2.1 1.5-3.4-2.9-6.4-.5-3.1.7-3.3 8.1-11.2-.5-3.3 4.1-6.4v-4.8l-9.5-16.6 3.1-16.6-1.7-2.9.7-3.1 3.1-2.4 1.4-5.2-5.9-20.4-2.2-2.9-1.9-6.4-5.9-7.4-1.9-11.1-2.2-3.4-6.4-5-4.7-10 1.1-1.4.3-1.9-2.4-2.1 1-6.4-3.1-2.4-1.4-2.9 1.9-2.4.9-.7v-1.6l-5-13.6 1.9-2.6-1.4-2.6-9.5-9-1-2.4-7.3-.7-30.9-25.2-1.7-3.1-2.8-1.9-3.8-1.2-2.2-2.1 1.9-5.3-5.9-15.7-5-5.2-3.8-13.5-7.4-3.1-3.1 1.9-2.8-1.5-2.2-2.6-3.3-.2-8.3-5.2.2-7.2-6.4-9.7.2-7.6-1.6-3.1-2.6-2.4-.3-4.3 1.9-2.6.5-3.1-5.7-4-3.6-.7-3.8.9-8-4.7-1.2-3.1.4-4.5-4.2-5.5-.8-3.8-2.8-1.7-1-2.6.3-2.6-9.5-5.2-3.4-6.7-5.4-3.6-12.9-21.3-.4-3.6 3.5-1 1.7-2.1.7-3.1-2.4-1.9-1.6-3.1-.9-4.1-3.1-4.5-2.6-1.9-1.6-2.3-.2-2.7-2.7-4.5 4.2-1.2-8.2-7.2-.2-2.9.7-2.5-3.7-9.6-7.1-4.2.4-2.5 2.1-2.7-.1-2.5-4.2-3.2.1-2.7 1.4-2 .5-2.7-1-2h-2.7l-3.2-1.4-1.2-2v-1.7h-3.3l-2.9-2.8 2.4-2.4-1.4-1.7-3.6-1.6.5-3.3-9.1-8.9-.2-2.8 1.9-2.6-1.4-3.8-2.4-3.3-2.4-1.7-2.6 2.4-4.1-1.5-3.5-3.1 2.1-1.8 3.4-1-1.5-2.8-4 .9-4.3-.9v-3.9l1.9-3.3-.7-2.8-4.3-.7-3.6.7 2.2 2.1v2.9l-3.3-2-1-2.8-7.1-7.8-3.3-1.5-5.5-5.4-2.9-.3-3.5 1.4-15.2-1.6-3.4.7-8.1-1.9-3.8 1.4-1.6 3.4-2.6-.5-4.3.7-3.3 5.5-3.6 1.6-15.7 1.2-1.9 2.9-10 4.7-3.3-.7-2.4-1.4-2.6 2.1-3.8 1.2-2.4 1.7 1.2 2.8V30l-8.5 12.6-2.4 9.9-9.3 5.7-7.4 18.8-14 5.7-8.1-2.4h-4.5l-10.9 4.1-15.2-1.7-4.8 4.3-7.3-.9-3.9.9-9.2 6.7-91.8 8.1-2.8 1.1-4.1 5.5-3.6 1.7-3.3-2.4-2.8 1.2-6.9 16.9-2.6 2.3-3.1 10.5-3.6.9-7.4 10.3-3.3 1.9-6.6 1.6-1.7 3.4-3.3.4-2.9-1.4-3.8 1.7-21.6-.5-3.3-8.3-7.4-7.6-1.7-10.5-7.6-2.1-2.6-3.6-.7-.2-4.5 1.4-2.2-2.2-2.6.5-3.6-.9-1.4-3.6-3.1-1.4-3.3-3.1-.5-3.1 1.2-2.6.2-3.4-10.4-14-3.6-.4-4.7-4.6-12.6 4.1h-3.6l-2.8-1.5-3.4-.6-3.5-2.2-7.6 2.4-8.3 10.9-3.4-.2-3.3-1.2-3.1.7-4.8 4.1-7.8 1.4-2.6 1.4-3.8-1.7-2.6-2.1-3.8-1.7-3.6-.2-2.9 1-4-.3-3.8-1.9-3.1-5.7-3.1-1.9-8.3-.7-3.3-3.1-3.1-1.2-2.9 1-3.8-1-5.9 3.8-10.2 2.1-1.9 1.9-2.7-.9-1.4-2.6-3.5-1.9-1.9-6.2-2.7-2.4-4.3-.5-4.1-2.8h-5.4l-3.4 2.7-4.7-1.7-5 2-8.8-5.7-10.4 1.4-3.3-2.7-4.3-1.2-1.1.2-4.4 10-2.9 1.4h-2.2l-4.3-1.7-3.4-3.4-5.3-1.3-7.8-6.4-5.4-1.7-4-7-5-1.4-2.4-4.3 2-5.1-6.7-6.4-4.7 2-5-.3-3.4-3.4-2.4-4.7-3-.3-2.7 1.3-.6 5.4-4.1 1.4v3.7l-3.3 3.3-1.4 5.1 1 4.7-3.7 2.7 1 4-9.7 1.7-3.7 2.3-8.4-4h-5.7l-4.8-3-2.3 4 3.4 3 .3 10.1h-5.4l-4 2-5.4 9.1-4 3.4-5.4.3-5 3-5.4.4-1.4 3.7 1.1 9.4-3.1 3.7-5.7-1-7.7 13.4-4.4 2.7-21.2 1.7-13.1-10.1h-3.7l-4.7 3-5 13.8-4.1-.7-4 2.1-5.4-2.7-4-4.4-3.7 2.7-.7 4-4.7 2.7-4.7 1-2 8.8-4.7 2-3 2.7.3 5-1.4 1.7-4.3 13.8-3.4 3-8.1 1.4-1.6 4.3-4.4 2.7-2.4 2.7-3.3-1.3-4.1 4 2.1 4h-3.8l-4 1.7-4 9.4-.7 4.7 4.4 16.2-1.3 7.7v.5l-3.1 3.8-10.4 1-3.7 2.1-13.8 25.5 1.4 4.1-6.1 7-1.7 3.7 2.4 4.7-.4 4.7-2 3.4-7 6.7-2 3.4-2.4 8.4-2.7 3.7-5.4.6-8.1 4.8-5.6 10-7.8 4.4 2.4 5.4 3 3-2 9.1.3 4.3-3.7 2.1-3.3 3.7-5.4 1-3 3.3.3 5.8 1.7 4.7-2.7 3v4l-14.2 6.4-2.6 4.4v5.7l-2 5.4-3.8 2.7-1 4.7 3.7 3 3.4 4.7.3 4.7-4.3 3.7-2.2 3.6-14-.9-.5 3.6 5.3 4.7-.1 2.6-.4 1.2-7.4 1.7-1.7 2.1v2.9l-7.1-2.6-9.5 2.8-2.1 2.4-2.9 6.4 1.7 3.1-.2 3.1-2 2.1-1.1 2.7-1.9 2.1-3.9 1.6-3.3 11.4 2.6 6.5 4.1 1.2 3.5 6.6-.4 3.8-3.8 6v3.1l-2.7 1.4-3.3-2.2-7.6-.4-2.8 2.4-3.6 17.3-3.1 1.4-2.6 5.5 2.1 3.1-2.8 2.8-7.4-1.6-3.3 1.2-1.9 3-.7 4.3-4.8 5.3-3.1 1.9-3.3-1-5.2-5-4.1 1-7.8-1.5-4.5-4.2-3.4.7-1.9 2.8-3-.9-4.6-6-20.2 2.4-3.3 2.1-1.9 3.6-.5 7.6 1.7 4.1-2.6 1.6-3.8.3-6 13.3-2.4 1.9-.6 1-1 .9-3.4.5-3.3-1.5-.7 3.6-2.4 2.9-19.9-18.4-3.8-.2-1.9-2.1-2.7 1.4-.7 6.2-3.8 4.3-3.1 1.6-4.2-.5-6.7-4-8.1-.7-.9-2.9-3.6 1-2.8 1.9-6.5.9-7.1 6.5 1.2 2.8-1.2 1.7.5 3.8 3.1 2.1 3.8 1.2.7 3.3 1.7 3.1 2.8 2.6.7 1.2.5.3 2.9 18.3 9.7 9 3.8-1.4h4.3l1.9 3.1 3.3 2.6 6 17.6 3.7 1.2 5.8-4.3 3 1.2.7 6.6 1.3 2.6 2.8 1.9 3.6 1 3.1 2.4 4.5 6.2 1.1 3.5-1.4 2.6-.2 3.4 1.9 2.3 4 1.9 1.5 3.1.4 6.7 4.1 1.4 8.5-1.2 3.8 1 1.5-7.4 3-1.4 5 5-.4 3.5-4.1 5.5-2.6 12.8 2.3 9-4.4 6.4-.7 4.7-3.3 4 9 13.8 1.7 5.7-.3 4-9.8 7.4-1.6 3.7 2.6 2.7 14.1 4.7 4.1 3.1.3 5-1 3.7 3 3 5.4.4 2 4.3.7 4.7 8.1 6.8 3 4.3 4 3.4 1.4 5.7 4.3-2.7 4.4 1.7 3.1 2.7 1.3.3 3 5.4 4.1-2h4.7l2.6-3.4 4.8-1.3 2.6 13.7 3.4 2.1-1.4 4 13.2 6.7 8-1.7 5.1 2.1 3.7 4 5.4-1 3.6 2.3 3.4-.6 3.7 4.7 9.8 5.3 1.6 5.8 5.1 1.3 2.7 4.4-2.4 3.7-9 5-.7 5.4 1.3 4.4-6.7 7 .3 4.1-2.7 2.7-14.8 2.7-1.3 4 9.7 10.4.7 3 25.9 13.1 1 9.1-34.6 7.8-3.7 3-2.7 4 .1 7 3.3.7 3 5.8 25.9 9 10.4.7 4.4 2.7 2.7 4 1.3 17.8 2.3 4.4 5.1 2.7 45.7 4.4 5.1 2.3 5.3.4 9.8 3.7 5.7-.4 3.7 3.4 5 10.4.4 9.7 2.3 4.1 4.1 3.3 2 3.7.7 6.4 3.3 3.4.3.7 13.2 3 4.7-1.3 18.8-35.7-.3-4.3 4-3.1 3-4 1.7-4.7 8.7-4.7 5.7-.4 5.1-2.3 6.7-6.7 5.7 1.3 29.3 27.3 17.1 2.6 14.5 18.8-1.4 4.4-9.7 3.4-5.7-.3-10.1-7.1-10.8-1.7-3.3 3.7-1.7 11.4-3.4 3.7-16.1 1.1-1.7 4 1 4.4 6.7 7 .4 14.1 11.1 17.9 3.7 3.3 16.1 4.7 5.7 3.7.7 1.1v4.1l-2.4 6.6.5 4.3 2.6 3.3 8.6 2.4 41.1 30.2 20.9 5.2 2.6 2.1.5 3.4-5 9.7-26.6 11.2-2.6 2.2-4.1 14.7-3.8 5.7-2.3 7.1 2.3 8.1 3.8 5.7 32.8 13.3 11 1.2 35.9-14.7 16.4-.5 4 1.7 16.9-.8 6.4 2.2.7.8 34.3 14.1 12.9-2.2 105.8 35.8 23.3-5.4 10 1 31.4-16.7 24.4 5.4 19.7 14.1 55.3-8.2 28.1 11.3 11.7-3.1 52.8 20.3 5-1.3 9.2-5.2 9.1-2 9 .6 5.8-2.4 3.9-4.2 13.4-5.6 8.8-.5 88.5-84.5 54-17.5 4.5 1 74.5-15.8 15.5-10.5 35.9-8.3 41.6 6.2 7.6-1.8 2.6-1.9 1.8 4.1.3 2.7-.8 3.5 2 3 3 2.3 7.5 2 13.5 14.5h4.3l7.5-2.8 28.5 1.3 3.5-1 4.7-5.5 3.5-1.5 6 5.2 5.8 16.8 7.7 2 18.5-2.3 16.5-11 4-1 16 45.3 46.8 21.7 27.7.8 17.5 5.2 31.5-2.7.9-.5-.1-24.5 3.5-8 1-12.8 4.2-6.5.5-8.7 6.3-13-11.3-45.8 3.3-1.7 1.7-2-2.2-12-4.3-5-4-15.8 5-14.2 3.5-3.8 5.3-2.5 52-75 .5-3.5 1.6-3.5-9.4 13.5-3.7 1-2.3 2.3-3 1.5-1.2 3.7-6.8 4.8-3.7 6.5-1.5 7-2.8 3-1.5-2.8 2.8-19.7-3.8-.8-4.2 6-1 3.5v8.5l-2-1.5-.8-4.2-2.7-3.3-1.3-3.5 2.5-1.5 3.3 1 .7-7.2 3.3-1.8 2.2 3 4.5-4.5-.2-1.2-3.3-.3.3-6.5-2.3-3 2.8-2.2 3.7-1 2.3.7-3.3 3.5 1 2.8 23.5-23.3 4-.7 4 1.7 4.8-3.2.2-1.2-1.7-1.6-3.8.3-10.5-4.5-3.5.5 3.3 1 2.5 2.7-.5 3.3-18.3 13.2-3.2-1.5-2.3-2.5-1-3.5 1-2.7 3-2.8-1.5-2-4-.5-.5-1.5.5-2-4.5.3-3.7-1-1.3 3.7-2.2.5-.5-3.5.7-3-2.2-4 3 .5 3 3.5 4 1.5 3.2-1 .8-4.2 6.2 1.2 13-8.5h8l5-1.5-5.2-6v-3.5l3.5-1.5 1.7-2.7-4.7-.5.2-3 4.3-1 2-2.5-19-15.3-1-3.7 1-3.3-1.5-3.5.5-3.7-.8-4 .5-3.5 13.3-7.8 3.2-.5 2.8-1.7 1.5-4.3-.5-3.5 4.5-.2 1.7 1.7 2.8 1.3 4-.5 15.2 7.5-1.5 2.5-.2 3.2-7.8 2.5-3 2.5-1.5 3.3-.2 4 4 18 5 7 2.2-2 4.5-1.5V973l-3.2-2.5-1-4.8 3-.5 11.2 13.8-2.5 7.7-20.5 13.5-11.7 3.5 6.7 14.8 2.3 1 22-24.5 85.7-18.8 9.5-8-1 6 3-2 1-6.5-3-5 4-5 6-72 5-6.5-1-2.5z"
  })));
};

RomaniaMap$1.defaultProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 1923.3 1350.6"
};
var categoryColors = {
  permanent_lists: "#55505C",
  supplementary_lists: "#5D737E",
  mobile_ballot_box: "#7FC6A4",
  vote_by_mail: "#F1C692",
  default: "#55505C"
};
var categoryLabels = {
  permanent_lists: "Votanți liste permanente",
  supplementary_lists: "Votanți liste suplimentare",
  mobile_ballot_box: "Votanți urnă mobilă",
  vote_by_mail: "Votanți prin corespondență",
  default: "Categorie necunoscută"
};
var breakdownTypeLabels = {
  national: "România",
  diaspora: "Diaspora",
  all: ""
};

var adjustScale = x => {
  var div = 10;

  while (x * 10 > div) {
    x = Math.ceil(x / div) * div;
    div *= 10;
  }

  return x;
};

var ElectionTurnoutBreakdownChart = themable("ElectionTurnoutBreakdownChart", cssClasses$b)((_ref) => {
  var _value$total;

  var classes = _ref.classes,
      value = _ref.value,
      scope = _ref.scope;

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      ref = _useDimensions2[0],
      width = _useDimensions2[1].width;

  var type = value.type;

  if (type === "all" && scope) {
    if (scope.type === "national") {
      type = "national";
    } else if (scope.type === "diaspora") {
      type = "diaspora";
    }
  }

  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.chartRow
  }, type !== "all" && /*#__PURE__*/React.createElement("div", {
    className: classes.infoRow
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.typeLabel
  }, breakdownTypeLabels[value.type]), /*#__PURE__*/React.createElement("div", {
    className: classes.mapIconContainer
  }, type === "diaspora" && /*#__PURE__*/React.createElement(WorldMap$1, {
    className: classes.worldMapIcon
  }), type === "national" && /*#__PURE__*/React.createElement(RomaniaMap$1, {
    className: classes.romaniaMapIcon
  }))), /*#__PURE__*/React.createElement("div", {
    className: classes.chartContainer,
    ref: ref
  }, /*#__PURE__*/React.createElement(BarChart, {
    className: classes.chart,
    width: width !== null && width !== void 0 ? width : 1,
    yMax: (_value$total = value.total) !== null && _value$total !== void 0 ? _value$total : adjustScale(value.categories.reduce((acc, category) => Math.max(acc, category.votes), 0)),
    renderLabel: value.total != null ? x => formatPercentage(x / (value.total || 0)) : formatGroupedNumber,
    bars: value.categories.map((_ref2) => {
      var _categoryColors$categ;

      var votes = _ref2.votes,
          categoryType = _ref2.type;
      return {
        value: votes,
        color: (_categoryColors$categ = categoryColors[categoryType]) !== null && _categoryColors$categ !== void 0 ? _categoryColors$categ : categoryColors.default
      };
    })
  }))), /*#__PURE__*/React.createElement(PercentageBarsLegend, {
    items: value.categories.map((_ref3) => {
      var _categoryLabels$categ, _categoryColors$categ2;

      var votes = _ref3.votes,
          categoryType = _ref3.type;
      return {
        legendName: (_categoryLabels$categ = categoryLabels[categoryType]) !== null && _categoryLabels$categ !== void 0 ? _categoryLabels$categ : categoryColors.default,
        legendColor: (_categoryColors$categ2 = categoryColors[categoryType]) !== null && _categoryColors$categ2 !== void 0 ? _categoryColors$categ2 : categoryColors.default,
        legendValueLabel: value.total != null ? formatPercentage(votes / value.total) : formatGroupedNumber(votes),
        legendNote: value.total != null && "(".concat(formatGroupedNumber(votes), ")")
      };
    })
  }));
});

var css_248z$c = ".ElectionTurnoutSection-module_warning__33sxL{margin-top:.5rem;margin-bottom:2rem}.ElectionTurnoutSection-module_percentageBars__21CxA{margin-top:1rem}.ElectionTurnoutSection-module_map__K2q9y{flex:1;margin-bottom:2rem}.ElectionTurnoutSection-module_mapBreakdownContainer__26fzW{margin-top:2rem;display:flex;flex-direction:row;width:100%;align-items:stretch}.ElectionTurnoutSection-module_breakdownContainer__1CAJD{display:flex;flex-direction:column;align-items:stretch;margin-right:2rem}.ElectionTurnoutSection-module_breakdown__3RTLT{flex-shrink:1;flex-grow:0;margin-bottom:2rem;width:20rem}.ElectionTurnoutSection-module_mapBreakdownContainerMobile__3ZAXg .ElectionTurnoutSection-module_map__K2q9y{flex:none}.ElectionTurnoutSection-module_mapBreakdownContainerMobile__3ZAXg .ElectionTurnoutSection-module_breakdownContainer__1CAJD{margin-right:0;flex:1}.ElectionTurnoutSection-module_mapBreakdownContainerMobile__3ZAXg .ElectionTurnoutSection-module_breakdown__3RTLT{flex-grow:1;width:100%;max-width:none}.ElectionTurnoutSection-module_mapBreakdownContainerFullWidth__2I2Gq{flex-direction:column-reverse}.ElectionTurnoutSection-module_mapBreakdownContainerFullWidth__2I2Gq .ElectionTurnoutSection-module_map__K2q9y{flex:none}.ElectionTurnoutSection-module_mapBreakdownContainerFullWidth__2I2Gq .ElectionTurnoutSection-module_breakdownContainer__1CAJD{flex-direction:row;flex-wrap:wrap;justify-content:space-around}.ElectionTurnoutSection-module_mapOverlay__3d50V{position:absolute;left:48%;top:50%;transform:translate(-50%,-50%);width:100%;display:flex;flex-direction:column;align-items:center;color:#3e3e3e}.ElectionTurnoutSection-module_mapOverlayPercentage__2nDaR{font-size:1.52778em;line-height:1.3;font-weight:600}.ElectionTurnoutSection-module_mapOverlayLabel__1_0Dl{font-size:.55em;line-height:1.5}.ElectionTurnoutSection-module_totalVotesContainer__1Rs-G{display:flex;flex-direction:row;align-items:center}.ElectionTurnoutSection-module_totalVotesLabels__2_HHh{display:flex;flex-direction:column;margin-left:1rem}.ElectionTurnoutSection-module_totalVotesCount__2JveP{font-size:1.875rem;color:#505050}.ElectionTurnoutSection-module_totalVotesLabel__1VRji{font-size:1.125rem;color:#a8a8a8;margin-top:.25rem}";
var cssClasses$c = {
  "warning": "ElectionTurnoutSection-module_warning__33sxL",
  "percentageBars": "ElectionTurnoutSection-module_percentageBars__21CxA",
  "map": "ElectionTurnoutSection-module_map__K2q9y",
  "mapBreakdownContainer": "ElectionTurnoutSection-module_mapBreakdownContainer__26fzW",
  "breakdownContainer": "ElectionTurnoutSection-module_breakdownContainer__1CAJD",
  "breakdown": "ElectionTurnoutSection-module_breakdown__3RTLT",
  "mapBreakdownContainerMobile": "ElectionTurnoutSection-module_mapBreakdownContainerMobile__3ZAXg",
  "mapBreakdownContainerFullWidth": "ElectionTurnoutSection-module_mapBreakdownContainerFullWidth__2I2Gq",
  "mapOverlay": "ElectionTurnoutSection-module_mapOverlay__3d50V",
  "mapOverlayPercentage": "ElectionTurnoutSection-module_mapOverlayPercentage__2nDaR",
  "mapOverlayLabel": "ElectionTurnoutSection-module_mapOverlayLabel__1_0Dl",
  "totalVotesContainer": "ElectionTurnoutSection-module_totalVotesContainer__1Rs-G",
  "totalVotesLabels": "ElectionTurnoutSection-module_totalVotesLabels__2_HHh",
  "totalVotesCount": "ElectionTurnoutSection-module_totalVotesCount__2JveP",
  "totalVotesLabel": "ElectionTurnoutSection-module_totalVotesLabel__1VRji"
};
styleInject(css_248z$c);

var pageName = page => {
  switch (page) {
    case "turnout":
      return "prezența la vot";

    case "results":
      return "rezultatele";

    default:
      return "datele";
  }
};

var missingData = completeness => {
  if (completeness.missingCounty && completeness.missingLocality) {
    return "județul și localitatea";
  }

  if (completeness.missingCounty) {
    return "județul";
  }

  if (completeness.missingLocality) {
    return "localitatea";
  }

  if (completeness.missingCountry) {
    return "țara";
  }

  return "";
};

var ElectionScopeIncompleteWarning = (_ref) => {
  var className = _ref.className,
      completeness = _ref.completeness,
      page = _ref.page;
  return completeness.complete ? null : /*#__PURE__*/React.createElement(DivBodyHuge, {
    className: className
  }, "Pentru a vizualiza ", pageName(page), ", te rug\u0103m s\u0103 selectezi ", /*#__PURE__*/React.createElement(Underlined, null, missingData(completeness)), ".");
};

var BallotCheckmark = function BallotCheckmark(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M42.75 22.5h-4.5V27h1.575c.373 0 .675.253.675.563v1.125c0 .309-.302.562-.675.562H5.175c-.373 0-.675-.253-.675-.563v-1.125c0-.309.302-.562.675-.562H6.75v-4.5h-4.5A2.248 2.248 0 0 0 0 24.75v6.75a2.248 2.248 0 0 0 2.25 2.25h40.5A2.248 2.248 0 0 0 45 31.5v-6.75a2.248 2.248 0 0 0-2.25-2.25zM36 27V4.521a2.27 2.27 0 0 0-2.271-2.271h-22.45A2.276 2.276 0 0 0 9 4.521V27h27zM14.85 14.203l1.793-1.779a.75.75 0 0 1 1.069.007l2.904 2.925 6.693-6.637a.75.75 0 0 1 1.07.007l1.778 1.793a.75.75 0 0 1-.007 1.069l-9.021 8.943a.749.749 0 0 1-1.069-.007l-5.21-5.252a.75.75 0 0 1 0-1.069z",
    fill: "#352245"
  }));
};

BallotCheckmark.defaultProps = {
  width: "45",
  height: "36",
  viewBox: "0 0 45 36",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};
var defaultConstants$1 = {
  breakpoint1: 1000,
  breakpoint2: 840,
  breakpoint3: 480
};
var ElectionTurnoutSection = themable("ElectionTurnoutSection", cssClasses$c, defaultConstants$1)((_ref) => {
  var _turnout$breakdown$le, _turnout$breakdown, _turnout$breakdown2;

  var meta = _ref.meta,
      scope = _ref.scope,
      turnout = _ref.turnout,
      classes = _ref.classes,
      constants = _ref.constants;
  var involvesDiaspora = electionTypeInvolvesDiaspora(meta.type);

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      measureRef = _useDimensions2[0],
      width = _useDimensions2[1].width;

  var completeness = electionScopeIsComplete(scope);
  var map = width != null && /*#__PURE__*/React.createElement(ElectionMap, {
    scope: scope,
    involvesDiaspora: involvesDiaspora,
    className: classes.map
  }, scope.type === "national" && turnout && turnout.eligibleVoters && /*#__PURE__*/React.createElement("div", {
    className: classes.mapOverlay
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.mapOverlayPercentage
  }, formatPercentage(turnout.totalVotes / turnout.eligibleVoters)), /*#__PURE__*/React.createElement("div", {
    className: classes.mapOverlayLabel
  }, "Total prezen\u021B\u0103 la vot \xEEn Rom\xE2nia \u0219i Diaspora")));
  var breakpoint1 = constants.breakpoint1,
      breakpoint2 = constants.breakpoint2,
      breakpoint3 = constants.breakpoint3;
  var mobileMap = width != null && width <= breakpoint3;
  var fullWidthMap = !mobileMap && width != null && width <= (scope.type === "national" && involvesDiaspora ? breakpoint1 : breakpoint2);
  var showHeading = turnout != null && completeness.complete;
  return /*#__PURE__*/React.createElement(React.Fragment, null, mobileMap && map, showHeading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading2, null, "Prezen\u021Ba la vot"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, getScopeName(scope)))), !completeness.complete && /*#__PURE__*/React.createElement(ElectionScopeIncompleteWarning, {
    className: classes.warning,
    completeness: completeness,
    page: "turnout"
  }), turnout == null && completeness.complete && /*#__PURE__*/React.createElement(DivBodyHuge, {
    className: classes.warning
  }, "Nu exist\u0103 date despre prezen\u021Ba la vot pentru acest nivel de detaliu."), turnout && turnout.eligibleVoters != null && /*#__PURE__*/React.createElement(ElectionTurnoutBars, {
    className: classes.percentageBars,
    eligibleVoters: turnout.eligibleVoters,
    totalVotes: turnout.totalVotes
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    },
    ref: measureRef
  }), /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(mergeClasses(classes.mapBreakdownContainer, fullWidthMap && classes.mapBreakdownContainerFullWidth), mobileMap && classes.mapBreakdownContainerMobile)
  }, turnout && completeness.complete && (((_turnout$breakdown$le = (_turnout$breakdown = turnout.breakdown) === null || _turnout$breakdown === void 0 ? void 0 : _turnout$breakdown.length) !== null && _turnout$breakdown$le !== void 0 ? _turnout$breakdown$le : 0) > 0 || turnout.eligibleVoters == null) && /*#__PURE__*/React.createElement("div", {
    className: classes.breakdownContainer
  }, turnout.eligibleVoters == null && /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.breakdown, classes.totalVotesContainer)
  }, /*#__PURE__*/React.createElement(BallotCheckmark, null), /*#__PURE__*/React.createElement("div", {
    className: classes.totalVotesLabels
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.totalVotesCount
  }, formatGroupedNumber(turnout.totalVotes)), /*#__PURE__*/React.createElement("div", {
    className: classes.totalVotesLabel
  }, "Votan\u021Bi ", getScopeName(scope)))), (_turnout$breakdown2 = turnout.breakdown) === null || _turnout$breakdown2 === void 0 ? void 0 : _turnout$breakdown2.map((breakdown, index) => /*#__PURE__*/React.createElement(ElectionTurnoutBreakdownChart, {
    key: index,
    className: classes.breakdown,
    value: breakdown,
    scope: completeness.complete
  }))), !mobileMap && map));
});

var css_248z$d = ".ElectionObservationSection-module_root__29siq{margin-bottom:2rem}.ElectionObservationSection-module_showcase__15R-r{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-around;align-items:flex-start}.ElectionObservationSection-module_showcaseItem__2ZPNs{width:8rem;margin:2rem 1rem;display:flex;flex-direction:column;align-items:stretch}.ElectionObservationSection-module_showcaseIcon__20wyI{height:6rem;display:flex;flex-direction:row;align-items:flex-end}.ElectionObservationSection-module_showcaseIcon__20wyI svg{width:100%}.ElectionObservationSection-module_showcaseValue__1dAGm{font-size:2.25rem;font-weight:600;line-height:1.5;text-align:center}.ElectionObservationSection-module_showcaseText__wauQ9{text-align:center}";
var cssClasses$d = {
  "root": "ElectionObservationSection-module_root__29siq",
  "showcase": "ElectionObservationSection-module_showcase__15R-r",
  "showcaseItem": "ElectionObservationSection-module_showcaseItem__2ZPNs",
  "showcaseIcon": "ElectionObservationSection-module_showcaseIcon__20wyI",
  "showcaseValue": "ElectionObservationSection-module_showcaseValue__1dAGm",
  "showcaseText": "ElectionObservationSection-module_showcaseText__wauQ9"
};
styleInject(css_248z$d);

var BallotDrop = function BallotDrop(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M119.973 73H4.027c-3.815 0-5.087-2.76-2.755-6.155l11.446-16.552c1.484-1.91 4.663-3.608 7.419-3.608h83.726c2.756 0 6.147 1.486 7.419 3.608l11.446 16.552c2.332 3.396 1.06 6.154-2.755 6.154z",
    fill: "#FECC3D"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M119.973 73H4.027c-3.815 0-5.087-2.76-2.755-6.155l11.446-16.552c1.484-1.91 4.663-3.608 7.419-3.608h83.726c2.756 0 6.147 1.486 7.419 3.608l11.446 16.552c2.332 3.396 1.06 6.154-2.755 6.154z",
    fill: "#FC0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M84.999 55.387H39.002c-3.18 0-5.935.636-6.359 1.485l-.636 1.698c-.424.849 2.12 1.697 5.511 1.697h48.964c3.392 0 5.724-.848 5.511-1.697l-.847-1.486c-.212-.848-3.18-1.697-6.147-1.697z",
    fill: "#355168"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M30.735 30.77L47.27 60.055 99.2 29.285 82.667 0 30.735 30.77z",
    fill: "#E8E8E8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44.514 32.892l2.967-1.697 4.875 4.88 3.392 3.396-1.272-4.457-1.908-6.578 2.756-1.698 3.603 14.43-3.391 1.91-11.022-10.186zM59.139 32.47c-2.332-4.032-1.484-7.64 1.907-9.55 3.392-1.91 6.995-1.061 9.327 2.971s1.484 7.64-1.696 9.762c-3.391 1.697-6.995.636-9.538-3.184zm8.267-5.094c-1.484-2.334-3.392-3.183-5.088-2.334-1.695.849-1.907 2.971-.424 5.518 1.484 2.546 3.392 3.395 5.088 2.334 1.907-.849 1.907-2.971.424-5.518zM72.493 19.524l-3.391 1.91-1.484-2.335 9.539-5.517 1.271 2.334-3.391 1.91 5.935 9.974-2.755 1.698-5.724-9.974z",
    fill: "#352245"
  }));
};

BallotDrop.defaultProps = {
  width: "124",
  height: "73",
  viewBox: "0 0 124 73",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var RaisedHands = function RaisedHands(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#a)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M40.174 43.362c-.141.988-.141 2.118-.423 3.107-.282.847-.846 1.554-.987 2.542-.141.706 0 1.554 0 2.401v1.13h-1.269c-.845 0-.704.283-1.55.424-1.833 0-3.524-.282-5.357-.141-1.691 0-2.255-1.13-3.242-2.401-1.41-2.119-3.806-4.096-4.37-6.639-.282-.988-.564-2.118-.564-3.248v-1.978-.565c-.14-.565-.563-1.553-.281-1.977.14-.141.281-.283.704-.283.423 0 .987.142 1.269.424.564.424.987 1.271 1.128 1.978.14.565 0 1.13.14 1.553.142.706.564 1.413.846 1.978.141-1.695.141-3.249.141-5.085v-4.379c0-2.118.141-6.214.141-6.214v-.707c.141-.564.282-1.13.846-1.27a2.398 2.398 0 0 1 1.41 0c.564.282.564.847.704 1.553v7.062c0 .848.142 2.26.423 2.542.141-.14.141-.564.141-.847v-.847c0-.424 0-11.159.141-11.724.282-.847 1.692-.988 2.397-.565.705.424.705 11.582.705 12.289 0 .282.281.988.422.706.282-.706 0-11.158.423-11.44.564-.707 1.55-.707 2.256-.142.986.706.704 12.57 1.127 12.57.282.142.282-7.768.564-8.05.282-.283.846-.283 1.269-.283 1.691-.141 1.127 8.898 1.268 10.028-.281 2.26-.281 4.379-.422 6.498z",
    fill: "#E7B088"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M39.61 50.565l-12.405.282v2.825l12.405-.283v-2.825z",
    fill: "#D1E9F5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26.642 24.717v.989c0 .565.422.989.845 1.13.705.141 1.41-.424 1.41-1.13v-.989c0-.282-.282-.565-.564-.565h-1.128c-.281 0-.563.283-.563.565zM37.496 27.684v.706c0 .424.282.848.704.848a.964.964 0 0 0 .987-.989v-.706c0-.283-.282-.424-.423-.424l-.846.141c-.281 0-.422.142-.422.424zM22.695 37.994c0 .282-.282.423-.564.423v-.565c-.141-.565-.564-1.553-.282-1.977.282.282.986 1.271.846 2.119z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M29.742 52.967H24.95V75h4.792V52.967z",
    fill: "#22152D"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M41.583 52.967h-11.84V75h11.84V52.967z",
    fill: "#352245"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M30.024 22.174v.989c0 .565.423 1.13.987 1.13.705.141 1.41-.424 1.41-1.13v-.989c0-.282-.282-.565-.564-.565h-1.269c-.282 0-.564.283-.564.565zM33.83 23.305v.989c0 .565.424 1.13.846 1.13.705.141 1.41-.424 1.41-1.13v-.989c0-.282-.282-.565-.564-.565h-1.268c-.142.142-.423.283-.423.565z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.325 32.344c-.141.989-.141 2.119-.423 3.108-.282.847-.846 1.553-.987 2.542-.14.706 0 1.554 0 2.401v1.13h-1.268c-.846 0-.705.282-1.55.424-1.833 0-3.525-.283-5.357-.142-1.692 0-2.256-1.13-3.243-2.4-1.41-2.12-3.806-4.097-4.37-6.64C.847 31.78.565 30.65.565 29.52v-1.977-.565C.423 26.412 0 25.423.282 25c.14-.142.282-.283.705-.283s.986.141 1.268.424c.564.424.987 1.271 1.128 1.977.141.565 0 1.13.141 1.554.14.706.564 1.412.846 1.977 0-1.977 0-3.39-.141-5.226v-4.378c0-2.119.14-6.215.14-6.215v-.706c.142-.565.283-1.13.847-1.271.422-.142 1.127-.142 1.55.14.564.283.564.848.705 1.555v7.062c0 .847.14 2.26.423 2.542.14-.141.14-.565.14-.847v-.848c0-.424 0-11.158.142-11.723.282-.706 1.55-.989 2.255-.424.705.424.705 11.582.705 12.289 0 .282.282.988.423.706.282-.706 0-11.159.423-11.441.564-.706 1.55-.706 2.255-.141.987.706.705 12.57 1.128 12.57.282.142.282-7.768.564-8.05.281-.283.845-.283 1.268-.283 1.692-.141 1.128 8.898 1.269 10.028.14 2.119.14 4.238-.141 6.356z",
    fill: "#E7B088"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17.761 39.547l-12.263.141v2.825l12.263-.282v-2.684z",
    fill: "#D1E9F5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.934 13.7v.988c0 .565.422.99.845 1.13.705.142 1.41-.423 1.41-1.13V13.7c0-.283-.282-.565-.564-.565H5.356c-.281 0-.422.141-.422.565zM15.788 16.526v.706c0 .424.282.848.704.848a.964.964 0 0 0 .987-.99v-.705c0-.283-.282-.424-.423-.424l-.846.141c-.281 0-.422.283-.422.424zM.987 26.976c0 .283-.282.424-.564.424v-.565C.282 26.27-.141 25.28.14 24.857c.14.283.986 1.272.846 2.12z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.034 41.95H3.242V75.14h4.792V41.95z",
    fill: "#E2B500"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.734 41.95H7.894V75.14h11.84V41.95z",
    fill: "#FC0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.176 11.016v.989c0 .565.423 1.13.987 1.13.704.141 1.41-.424 1.41-1.13v-.989c0-.282-.283-.565-.565-.565H8.74c-.282 0-.564.283-.564.565zM11.981 12.288v.988c0 .565.423 1.13.846 1.13.705.141 1.41-.424 1.41-1.13v-.988c0-.283-.282-.565-.564-.565h-1.128c-.282 0-.564.282-.564.565z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M61.882 22.317c-.14.988-.14 2.118-.423 3.107-.282.848-.846 1.554-.987 2.542-.14.707 0 1.554 0 2.401v1.13h-1.268c-.846 0-.705.283-1.55.424-1.833 0-3.525-.282-5.357-.141-1.692 0-2.256-1.13-3.242-2.401-1.41-2.119-3.806-4.096-4.37-6.639-.282-.988-.564-2.118-.564-3.248v-1.978-.565c-.141-.565-.564-1.553-.282-1.977.14-.141.282-.282.705-.282s.987.14 1.268.423c.564.424.987 1.271 1.128 1.978.141.565 0 1.13.141 1.553.141.707.564 1.413.846 1.978v-5.085-4.379c0-2.118.14-6.214.14-6.214v-.706c.142-.565.283-1.13.847-1.272a2.398 2.398 0 0 1 1.41 0c.563.283.563.848.704 1.554v7.062c0 .848.141 2.26.423 2.543.14-.142.14-.565.14-.848v-.847c0-.424 0-11.159.142-11.723.282-.848 1.691-.99 2.396-.565.705.423.705 11.582.705 12.288 0 .282.282.988.423.706.282-.706 0-11.158.423-11.44.564-.707 1.55-.707 2.255-.142.987.706.705 12.57 1.128 12.57.282.142.282-7.768.564-8.05.282-.283.845-.283 1.268-.283 1.692-.141 1.128 8.899 1.269 10.028 0 2.26 0 4.379-.282 6.498z",
    fill: "#E7B088"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M61.318 29.52l-12.263.282v2.684l12.263-.142V29.52z",
    fill: "#D1E9F5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M48.49 3.672v.99c0 .564.424.988.846 1.129.705.141 1.41-.424 1.41-1.13v-.989c0-.282-.282-.565-.564-.565h-1.127c-.423 0-.564.283-.564.565zM59.345 6.497v.706c0 .424.282.847.705.847a.965.965 0 0 0 .986-.988v-.707c0-.282-.282-.423-.423-.423l-.845.14c-.282 0-.423.283-.423.425zM44.544 16.949c0 .282-.282.423-.564.423v-.564c-.141-.566-.564-1.554-.282-1.978.14.283.987 1.271.846 2.119z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M51.592 31.922h-4.793v43.22h4.793v-43.22z",
    fill: "#E2B500"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M63.291 31.922h-11.84v43.22h11.84v-43.22z",
    fill: "#FC0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M51.873.989v.989c0 .564.423 1.13.987 1.13.705.14 1.41-.424 1.41-1.13v-.99c0-.282-.282-.564-.564-.564h-1.269c-.422.141-.563.282-.563.565zM55.539 2.26v.989c0 .565.422 1.13.845 1.13.705.141 1.41-.424 1.41-1.13V2.26c0-.282-.282-.565-.564-.565h-1.268c-.142 0-.423.283-.423.565z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M83.731 48.305c-.14.989-.14 2.119-.423 3.107-.282.848-.845 1.554-.986 2.543-.141.706 0 1.553 0 2.4v1.131h-1.269c-.846 0-.705.282-1.55.424-1.833 0-3.525-.283-5.357-.142-1.692 0-2.256-1.13-3.242-2.4-1.41-2.12-3.806-4.097-4.37-6.64-.282-.988-.564-2.118-.564-3.248v-1.977-.565c-.14-.565-.564-1.554-.282-1.978.141-.14.282-.282.705-.282s.987.141 1.269.424c.563.423.986 1.27 1.127 1.977.141.565 0 1.13.141 1.554.141.706.564 1.412.846 1.977.141-1.836.141-3.248.141-5.085v-4.378c0-2.119.14-6.215.14-6.215v-.706c.142-.565.283-1.13.847-1.271a2.397 2.397 0 0 1 1.41 0c.563.282.563.847.704 1.553V37.571c0 .847.141 2.26.423 2.542-.141-.141-.141-.565-.141-.848v-.847c0-.424 0-11.158.141-11.723.282-.848 1.691-.989 2.396-.565.705.424.705 11.582.705 12.288 0 .282.282.989.423.706.282-.706.141-11.158.423-11.44.564-.707 1.55-.707 2.255-.142.987.706.705 12.57 1.128 12.57.282.142.282-7.768.564-8.05.282-.282.846-.282 1.269-.282 1.691-.142 1.127 8.898 1.268 10.028 0 2.118.141 4.378-.14 6.497z",
    fill: "#E7B088"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M83.168 55.508l-12.264.141v2.825l12.264-.283v-2.683z",
    fill: "#D1E9F5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70.199 29.52v.989c0 .565.423.988.846 1.13.704.14 1.41-.424 1.41-1.13v-.989c0-.282-.283-.565-.565-.565h-1.127c-.282.141-.564.283-.564.565zM81.053 32.485v.706c0 .424.282.848.704.848a.965.965 0 0 0 .987-.99v-.705c0-.283-.282-.424-.423-.424l-.845.141c-.282 0-.423.283-.423.424zM66.393 42.937c0 .282-.282.424-.564.424v-.565c-.141-.565-.564-1.554-.282-1.978.14.283.846 1.272.846 2.119z",
    fill: "#F2C4A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M73.3 57.91h-4.793v17.232H73.3V57.91z",
    fill: "#22152D"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M85.14 57.91H73.3v17.232h11.84V57.91z",
    fill: "#352245"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M73.582 26.977v.989c0 .565.423 1.13.987 1.13.705.141 1.41-.424 1.41-1.13v-.989c0-.282-.282-.565-.564-.565h-1.27c-.281 0-.563.283-.563.565zM77.388 28.249v.988c0 .565.423 1.13.846 1.13.704.142 1.41-.424 1.41-1.13v-.988c0-.283-.283-.565-.565-.565h-1.268c-.141 0-.423.282-.423.565z",
    fill: "#F2C4A5"
  })), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "a"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M0 0h85v75H0z"
  }))));
};

RaisedHands.defaultProps = {
  width: "85",
  height: "75",
  viewBox: "0 0 85 75",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var RomaniaCountyMap = function RomaniaCountyMap(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M33.32 33.844l.257.328.651.172.755-.345.926.09.255.326.084.604.218.104-.083.478.563.012.188-.432.687-.306.27-.033.067.259.621.12 1.26-.683.258-.357.353-.049.916.553.36.492.218-.074.388.255.746-.228.292.404-.379.469-.068.49.107.18.606.171.514-.114-.318-.38.302.031-.1-.268.379-.283.357.075 1.074-.27.234.064.088.292.32.053 1.301-.259.144.424.31.013.27-.423.241-.027-.2 1.011-.306.324.128.286.916.661.666.004.169.678.668.351v.289l.275-.04.425.367-.743.443.11.165-.212.516.346.278-.044.17-.78.395-.447.033-.33.58-.396.26.075.172-.345.46.088.373-.508.308-.012.284-.494-.792-.91-.002-.535.585.257.168-.143.379.096.355-.369.22-.272.456-1.051.14.12.107-.144.282.233.19-.262 1.163-.369-.076-.724.408-.152.337.554.457-.268.084-.184.367-.508.202-.136.414.034.51.73.647-.14.435.173.233-.353.247-.134.416.324.29.188.506.078.865-.349.106-.456-.077-.3-.99-.489-.47-.278.021-.141-.502-.96-.194.018-.678-.521-.271.421-.606-.717-.682.257-.773-.4-.416-.267-.907.035-1.06-.33-.578-.52-.308-.664-1.472.099-.36-.589.132-.406-.355-.307.06-.393-.224-.133-.522.15-.265-.393-.798.253-.133.266.121-.066-.75-.275-.097-.255-.392-.239.15-.641-.37-.457-.784.178-.353-.366-.774-1.54.049-.407-.451-.32-.033-.663-.2-.21-.39-.176-.844.275-.404-.25-.586.044-.694.596-.428-.361-.223.008-.237.608-.442.817.565zM57.198 51.366l1.676-.098.251.294.71-.08.518.205.302-.168.596.15.355-.168.852.241.981.943.675.23.068.717.25.371-.028.584.41.12.203-.124.047.604.175.161.053.475-.267 1.131-.321.402.149.818-.588.227.062.57-.353.154-.294-.196-.569-.908-.25.264.005.37.271.052-.149.914.2.092-.063.204.26.4-.171.508-.304-.12-.14.392.23.373.245-.059.125.263.185-.004.137.431-.304.334-.124.692.39 1.565.052 1.102-.267 1.44.586.332-.423.641-.353.05.48.476-.102.349.943.998.073.465-.21.321.253.598-.149.177.065.408-.153.127-.587-.112-1.8.808-.96-.067-.438.436-1.343.1-.221-.218-.35.126-.086-.163-.631.012-.273-.385.04-.927-.177-.59.155-.616-.057-.745-.176-.259.172-.382-.547-1.54.24-.282.015-.43-1.053.048-.392-.414-.065-.77-.182-.054-.379-1.02.004-.63-.247-.016-.421.784.015.457-.81.06.157-.356-.15-.141.59-.86-.13-.268.273-.659-.255.026.47-.865-.139-.227.251-.714-.359-.347.314-.29-.086-.214-.19.006.011-.269.297.018.11-.45-.242-.372.2-.131.04-.334-.67-.878.407-1.2-.112-.54-.23-.043.2-.162.065-.561-.323-.182-.398-1.612.711-1.13-.043-.747.2-.204.773.104.653-.382.71.09.198-.127z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15.986 32.166l.849-.045.068.378.16-.09.168.23.16-.14.11.126.132-.38.613.07.318-.347 1.89.155.812-.206.243-.255.422.35-.357.544.9.28.57-.16.316-.543.17.28.23.014.004.225.7.183.053.247.694.02-.055.576.195.735.521.853.236-.147.262.175 1.36.147.076.68.725.859.524-.012.166.275.226-.144.098-.366 2.216.404.21.39.662.2-.421.384-.548.187-.27 1.643-1.18-.006-.11.182-.469.094-.324-.468-.688.572.2.602.518.422-.433.202-.026.247-.606.541.24.2.048 1.43-.5-.002-.117.268-.477-.053-.084.206.314.538.766.068.077.155-.292.475-.77-.471-.13-.514-.24.014-.223.71-.777-.324-.313.643-.55-.227-.521.192-.047-.349-1.563-.659-.063-.46-.888.205-.155.402-.325.241-.285-.204-.302.27-.229-.216-.406.527-.282-.04.002-.215-.469-.051-.147-.363-.406.579-.021.39-.28.153-.105-.547-.35-.192.013-.483-1.416-.692.051-.576-.321-.461-.857.823-.77.361-.181.457-.173.01-.176-.455-.536-.308.085.237-.418.108-.214.557-.72-.302-.35-.5-.198.014-.075.335-.402.29-.321-.37-.197-.738-.547.177-.543-.257-.513.108-.324-.65-1.07-.274-.677-.643-.102-.337-.563-.004-.149-.276-.231-.026.221-.127.196-.773.389.045-.118-.778.327-.51 1.218-.214.553.459.104-.25.25-.038.085.253.91-.043.163.307.347.104.496-.34.15-.695.748.023.051-.65.29-.261.083-.975.213-.21.912.126-.068-.157.292-.482-.204-.626-.28-.023-.17-.448.187-.747.202-.074.365-.667-.22-.16.143-.495.675-.363.549.273.125-.427.29-.124zM73.577 31.471l.264-.225.906-.043.098.864.285.177.502-.21.198.316.707-.216.308-.686.371-.224.386.888.657.238 1.1-.683.689-.02.225-.264.29.04.396.444.532-.627.88-.541.15-.661.627.059.096-.29.484.952.388-.115.124-.53.372-.265.063-.443.22-.139.008-.386.58.194-.094.396-.188.022.262.068.094.34.185-.177.135.53 1.237-.293.216.236.404-.26.298.452.357-.07.063.325.313-.426.26-.037 1.505 1.184-.221.428.229.384-.492.518.666.717.685 1.35.496 1.597.355.451.349 1.318-.224.394.14 1.145.21.834.256.182-.333.775-.28-.245-.142-.473-.26-.106-.46.002-.266.61-.592-.257-.104-.555-.228.118-.452-.133.094.352-.228.145-.468-.227-.224.345-.306-.202-.022.218-.61.414.026.215.28.053-.11.265.118.123-.137.124-.62-.22-.096.522-1.135-.506-.73.91-.76-.353-.694.259-1.088-.44-.997.293-1.125 1.006-1.622-.373-.157-.437.169-.224-.186-.313-.526.013-.567-.455.032-1.466-.241-.606-.77-.23-.1-.466.352-.47.06-.654-.329-.133-.64.523-.68.006.307-1.257-.124-.135.2-.269-1.576-.078-.951-.569.457-.41-.108-.149.16-.23.502-.258.067-.241-.12-.494-.833-1.267-.063-.292.234-.504-.4-.806z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25.432 14.344l.48.23.199.544.262.087-.06.456.433.01-.002.612.759.353-.182.151.302.988.613-.121.31.256.657-.282.44.218.162.46.384.05.118.447.467.462-.002.346-.7.292-.09 1.404-.314.194-.11.655-.235.213.143.19.317.012.089.538.331.33-.149.217.304.643.412-.098.325.537.663.087.135.229.308-.086.045.67-.54.679-.003.558 1.257.84-.702 1.47-.7.271-.159.435.712.342-.063.337.5.921-.38.357-.426-.135-.433.265.4.315.4-.308.423.071.48.345.038.27.243-.076.165.538-.137.711-.818-.564-.608.44-.008.238.361.224-.596.427-.043.694.249.587-.274.404.176.843-2.216-.404-.098.366-.225.144-.167-.275-.524.012-.725-.86-.076-.68-1.36-.146-.262-.175-.235.147-.522-.853-.194-.735.055-.577-.694-.02-.053-.247-.7-.182-.004-.225-.23-.014-.17-.28-.316.543-.57.16-.9-.28.356-.545-.421-.349-.244.255-.811.206-1.89-.155-.318.347-.614-.07-.131.38-.11-.126-.16.14-.17-.23-.158.09-.069-.378-.85.045.16-.255-.196-.096-.106-.408.51-.027.262.174.451-.635-.023-.35-.536-.5.451-.65.018-.667 1.014-.506.169-.404-.189-.766.48-.112.55-.561-.175-.153.269-.541-.506-.732.42-.1.562-.974.848-.188.31-1.18.52-.305-.087-.917.462-.679-.11-.267.771-1.596.886-.064.302-.634-.017-.755-.314-.47.173-.751.313-.43.202.193.118-.151-.19-.23.515-.21.42-.692.53.102.211-.335zM48.734 19.016l.143-.247.324-.092.19-.569.428-.312.258-1.374.897-.131.556.135.102-.308.347-.196.318-.904.684.06.375-.629.896.188 1.259.593.912-.147.582.288.631-.345 1.077.047.072-.406.426-.198.202.221.424-.18.662.12.251.021.734.602-.128.298.35.563.609.402-.559.486.263.243-.096.426-.314.114-.214-.179-.143.241-.006.263.416.56.359.15-.082.306.198.755-.528.443.302.527-.253 1.02.247.165.118 1.15-.588.46-.889-.095-.233.29-.66-.023-.783.612-.412.54-.25.838-.38.367-.219.828.279.231-.185.035-.03.257-.31.069-.617-.234-.396-.737-.04.212-.317.012-.143.48-.367.02.087.194-.343-.03-.11.961-.273.024.022.24-.447.197-.216 1.14-.373-.175-.698.46-.18-.188-.743.153-1.455-.916.086-.494.277-.155.049-.87.327-.079-.569-.525-.01-.257-.417.031-.14-.523-.462-.083-.123-.711.16-.334-.225-.158.474-1.04-.482-.878-.584.108-.25-.263.048-.345-.238-.388-.186.039-.012.204-.18-.273-.482-.043-.175-.292-.104-1.894.269-.245.412.266.586-.472-.069-.718zM76.965 72.396l-.85-.279.27-.417-.881-.138-.141-.955-.724.044-.598.262-.049.322-.298.137-.031.433.459.27.04.25-.66.031.15.618.526.088.442.465.623.288.208-.14.365.538.355-.13-.306-.581.241-.453.584-.11.275-.543zM63.343 41.097l.218-.063.806.565.145-.508.463-.267.282.198.22-.059.37.344.032.382.786.084.251.26-.11.595.618.785.737-.224.377.463-.269.608-.16-.043-.114.968.231.398-.069.388.647.151-.111.222-.428.037.18.169-.103.269.159.44.333.005.269.372.229-.002-.077.124.41.276.122.48.204-.025.084-.26.406-.038.21.277.457-.014.449.241-.02.208.55.563.566-.044.063.165.664.226.161.37-.231.31.731.216-.088.368.545-.002.472.487-.003 1.349-.599.669-.633-.63-.921-.01-.285.31-.166.943-.255.379-.483-.134-.217-.605-.289-.236-.768.32-.057-.175-.992-.28-.504.174-.202.271-1.122-.08-.484.19-.167.257-.469.239-.096.727-1.058.108-.175-.16-.047-.605-.204.124-.41-.12.028-.584-.25-.37-.068-.718-.675-.23-.98-.943-.853-.241-.355.169-.596-.151-.302.168-.517-.206-.71.08-.251-.293-1.677.098-.115-1.973-.605-1.659.738-.58 1.039-.083.057-.407-.731-.628-.21-.78.231-.116.451.22.202-.751.837-.079-.03-.498.393-.084.314-.632.702-.396-.04-.231.148-.54.77-.684.557.134.496-.212.543.24.124-.366.274-.164zM79.123 70.765l.642-.484-.387-.05.573-.609.43.286.382.614.588.212.886-1.341.183.113-.093.253.455.161-.05.443.172.18.47.12.1-.457.228.018-.053.559.427.168.304-.34.177.029-.028.176.651-.153.014.179.787-.253.923-.022-.023.42.766-.065.012.445.57.03.073-.322.877.294.088-.5.216.122-.051.258.443.093.172-.438.202.032-.006.357.81.088.088-.54.41.199-.017.166 1.598-.037.092-.823.247.029.04-.369.154-.004.153.08.084 1.491.912.143.067.634.937.27.492.386-.263.208.163.265-.131.096.316.357.196-.184.135.217.3.043.388-.729 2.045.698-.284.645-.753.94-1.645.158-.957.779-1.116-.126-.52.13-1.858 1.3-1.24-.061-.533-.21-.508.263-.894.108-1.859-.563-.857.27-1.133.053-2.031 1.002-.624-.02-1.182.415-.81-.05-1.18.326-.973-.073-.224-1.062.861-.506.13-.251-.19-.69-.17-.077.189-.247-.18-.373-.47-.027-.081-.318-.634-.198-.272-.505-.414-.271.316-.365-.273-.237.85-.531-.115-.02.194-.186-.166-.012-.094-.355.317.074-.125-.182.282-.014.222-.304.51-.031.772-.51-.159-.278-.723.08-.396-.488.664-.614zM28.473 50.188l.347.174.906 1.535.72-.182.178.382.494-.123-.069.616.224-.063.533.894.263 1.4-.496 1.165-.984.864.145.479-.175.516.418-.014.317.217-.245.41-.511.226-.342.77.208.277.924.208.13.374-1.316 1.655-.857.724.32.23-.322.297.002 1.194-1.118 1.754-1.698-.083-.738-.596-.201.488.1.541-.197.293-.368.045-.24 1.368.463.395-.194.87-.168.124-.151-.289-.328.08-.35-.478-.407.432-.46-.273-.065.138-.2-.514-.902-.261-1.465-.122-.178-.162-.887.164-.38-.198-.779.051-.6-1.731-.637-.233-1.704-.079-.233-.565-.322-.253-.082-.347h.127l.087-.462 1.037-.128.196.155 1.184-.38-.19-.753-1.36-.526-.993-1.07 1.214-.342.021-.557.33-.36-.153-.257.092-.28.635-.346-.16-.537-.285-.031-.12-.316.436-.194-.074-.287.297-.829.234-.141.014-.4-.394-.422-.126-.447-.412-.202-.35-.498-.103-.555.828-.174-.216-.253-.255.066-.141-.782 1.333-.533.389-1.126 1.204-.227.166.337.494.143.241.428.885-.173.496.086.021-.437.467-.088-.208.502.128.15.5-.136.166.262-.182.42.431.186.68-.017.348-.46-.125-1.062.225-.145.131.157.398-.367.4-.082.326-.6 1.349.837.651-1.434.304.214.602-.22.159.208.298-.3z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M111.262 67.793l.239.137-.084.255-.084-.323-.179.216.108-.285zm-1.598.14l-.066.26.052-.208-.178-.015.39-.257-.198.22zm1.855-.232l.247.208.261-.169-.957 1.347.69-1.049-.423-.396.182.06zm-1.272-.274l1.047.231-.781.459-.614.664-.066-.17.237-.284.794-.575-.474-.298-.569.173.426-.2zm-10.058-1.69l.522.158.492-.125.498.345-.153.304.259.17.247-.208.496.014-.021.798.898.457.127.273.824.106-.134.392.377.088.049-.165.349.06.037-.183.265-.038.163.516.643-.14.045-.356 2.053-.057-.026-.374.365-.089.259.355.288-.064.167.658.527-.017.089.174-.704.612.204-.478-.461.068.006.685.372-.004-.349.331-.341-.121-.196.386.1.178.192-.272.408.05-.333.956.076.594 1.153-1.692.728-.316.147-.241-.832 1.549-1.304 1.563-.733 1.198-.359.01-.382.372-.114 1.304.535 1.406-.319.255.339.2-.247.08.243.516-.22-.008.081-.167-.151-.133-.038.459-.207.05.513.058-.331.398.365 1.49-.694 1.614-.067.825-.382.85.125.223-.106.86-1.688.09-1.261-.327-1.445-.117-3.04-1.477-.621-2.453-.351-.445-.93.732-1.356.225-.346-.102-.45-1.17-.373-.312-.406.627-1.77-.17-.916.178-.551-.792-.834-.302-.225-.885.506-.262.535.21 1.24.062 1.856-1.3.522-.131 1.116.125.956-.778 1.646-.157.75-.94.285-.644.273-.7.888-1.147-.222-.806-.521-.483-.471-1.04.27-.807-.156-.415-.653-.661h-.398l-.698-.496-.147-.346.088-.615.912-.337.603.352.457-.037.504-.708zM66.916 42.034l.4-.165.322-1.104.77-.455.326-.531.913-.377.25-.443.339.037.325.322-.178.259 1.578 2.37.873-.19 1.24.032.217-.62.621.096.6-.25.485.22.127-.388.386.06.155-.471.475-.23.021-.58.771.23.241.605-.031 1.467.567.455.525-.014.186.314-.168.223.157.437v.979l-.604.58.037.661-.23.34.14.466-.177 1.059.231.341-.052 1.192-.457.228-.273 1.692-.227.384-.398.416-.438-.606-.41-.025-.349.24-.086.624-.54.918-.57.08.004-1.349-.472-.486-.545.002.088-.369-.731-.215.23-.31-.16-.37-.665-.226-.062-.165-.567.043-.55-.563.02-.207-.449-.242-.456.014-.21-.276-.406.037-.084.26-.204.026-.122-.48-.41-.277.077-.123-.23.002-.268-.373-.334-.004-.159-.441.104-.269-.18-.168.427-.038.112-.221-.647-.151.069-.388-.232-.398.114-.969.16.043.27-.608-.377-.462-.737.223-.618-.784.11-.596zM66.863 54.273l.233.257.15.64-.199 1.033.81.463.292.404.035.306-.266.221-.155.614.112.62.403.03.048.41.402.258.237.694.784.627.069 2.133.22-.164.437.068.182.312.373-.088.539.682-.212.21.135.418-.32.382.599.624.48-.192 1.006 1.447-.512.462.23.404.3-.398.212.008.017.343.204.118-.221.157.115.314-.474.168-.055.226.665.564-1.077.912-.388-.372-.257.86-.09.195-.302-.3-.612.217-.773-.26-.433.394-.604-.59-.541.566-.316-.227-.925.482-.44.694-.296-.17.23-.348-.214-.139-.233.043-.314-.223-.551.055.216.739-.869.794.057.114-.665.204-.478-.624.586.112.153-.127-.065-.408.15-.177-.254-.598.21-.321-.072-.465-.944-.998.102-.35-.48-.476.353-.049.423-.641-.586-.331.267-1.442-.051-1.102-.39-1.564.123-.693.304-.333-.137-.431-.184.004-.126-.263-.245.059-.23-.373.14-.392.304.12.17-.508-.259-.4.063-.204-.2-.092.15-.914-.271-.053-.006-.369.25-.264.57.907.294.197.352-.153-.062-.571.588-.227-.15-.818.322-.402.267-1.132-.053-.474 1.06-.108.095-.727.469-.24zM41.53 69.862l.486-.114.586-.568.623-.085.245.38 1.079-.178.227.304.136-2.253.21-.125.339.16.14.361-.115.414.183.094.102.5.145-.323.196.203 1.076.275-.084.677.253.139.194.865-.469.354.14.242-.485.49.39.178-.098.4.618.6.21-.233.278.121-.172.461 1.049.294-.108.26.87 1.03.026.346.57.204.416.508.322-.061.127.425.132-.006-.188.671.278.053-.533 2.663.472.455-.114.325.126.196-.222-.06-.068.176.3.27-.128.177.122.086-.275 1.216-1.023 1.304-.216 1.28.412.365-2.196-.945-1.406-.194-1.222-.514-.239-.292-.608-.053-1.088.228-.683-.232-.57-.523-1.11-.29-1.969.08-1.633.682-.992.21-2.39-.68-.271-.25-.194-.605.514-1.695.629-.415 1.006-.169.44-.741-.148-.614-.806-.176.137-.426.732-.753.798.316.231-1.483-.476-.248.021-.206.32-.093.33-1.047.586-.131.147-.657.639-.094-.033-.241-1.102-.606.088-.17.33.02.146-.678.514-.302.006-.188.49-.106-.294-.45 1.076.029.208-.236.245.145.265-.176.259.231.331-.286.161-.492z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M43.249 55.865l.417.34.236-.302.55.366.53.08.828-.439.686.408-.618 1.243.751 2.014-.517.347.023.985-.418 1.045-.34.192-.024.212.186.737-.175 1.435.251.028.27.649-.277.36.09 1.173-.237.645-.34-.16-.21.125-.135 2.253-.227-.304-1.079.178-.245-.38-.623.084-.587.569-.486.114-.68-.386.133-.322-1.22-.733-1.121-.489-1.755-.308-.312-.28-.01-.325-.763-.322-.394-.725-.143-.07-.184.219-.206-.144.131-.311-.423-.298-.455-2.153.325-.389-.064-.221-.222-.265-.276.01-.28-.565-.752-.62-.765-.198-.296-.566-.339-.087-.13-.374-.923-.208-.208-.276.341-.771.512-.226.245-.41.408-.321 1.841-.602.473.369 1.216-.185.304-.315.515 1.135.212.04.557-.489.075-.69 1.027.333 1.022-.643.833.116.23-.506.488-.022.05-.169.228.383.69.427 1.785-1.045zM92.657 41.729l.34.02.207.292-.06.584.176.292-.22.226.318.59.441.316.367-.242.01-.652.28-.124-.518-1.075.177-.043-.202-.207.069-.285.986.424.28-.226.304.167.54-.053.243.392.694-.137.25-.365-.011-.36.327-.16.016.44.459-.19.357.321.333-.1.177.58.323-.172.183.249.729-.23.492.112.073.132-.249.09.068.36-.204-.017.104.277-.147.1.194.27-.241.636.284.364-.092.184.342 1.014-.159.73.253.131-.063.245-.284.073.033.776.184.318-.127.112.27.256.255-.06-.129.386.292.455.047.484-.139.11.147.447-.165.508.194.104-.213.147.013.224-.353.092-.198-.136-.325.406.416.58.215-.093.098.204.126-.163-.096.24.217.301.002.469-.141.164.41.653.38.13-.266.296-.098.659-.657-.416-.53-.073-.855.661-.449.047-.12.18-1.256-.53-.341.323.086.098-.637.04-.385-.236-.04-.255-.5.141.097-.6-.231.092-.016-.172-.26.066.076-.212-.4-.039.074-.339-.366.169-.04-.351-.582.521-.147-.398-.457-.135-.131.141-.108-.237-.253.01.2-.179-.259-.325.1-.375-.306-.26.061-.275.33-.096-.263-.414-.22-.04.198-.244-.29-.061-.065-.308-.255.069-.208-.75-.325.156-.777-1.079-.058-.712-.361-.468-.369-1.432-.667-1.353-.25-.933v-.416l.688-.372-.036-.298.257-.375 1.589-.208-.071-.812.102-.082.584.431.104-.327zM66.981 71.62l.44-.695.925-.482.316.227.541-.567.604.59.433-.393.773.26.612-.217.302.3.09-.194.449-.055.222.231.18.247-.292.555.212.07-.244.48-.313-.128-.061-.35-.19.15.196.931-.518.46.85.603.095.282.908.216.226.218.074.24-.284.595.433-.557.65.614.344-.012.022.284.67.308.255-.06.13-.209.121.06.27-.399.11.12.267-.263.25-.343.413.27.273.506.633.198.082.318.47.028.18.372-.189.247.169.077.19.69-.13.251-.86.506.223 1.063-.753.184-1.331.716-.669.002-.521.323-.65 1.05-1.317.81-.951 1.454-.849.569-.363.639-.663.353-.76.01-.243-2.297-.42-.154.037-.294-.296-.451.233-.18.09-.981-.243-.385.16-.092-.165-.202-.114-1.17.445-.118-.178-.426.305-.496.185.09.05-.33.197.366.15-.457.34-.112-.74-.645.11-.767.387-.806-.318-.249-.016-.41-.154-.048-.102.325-.357-.231.111-.251-.478-.232-.235.116-1.31-.259.047-.467.275-.356-.12-.151.345-.377-.61-.441.212-.451-.275-.365z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M32.633 37.727l.32.033.407.45 1.54-.048.366.774-.178.353.456.785.642.368.239-.149.255.392.274.097.067.75-.267-.121-.253.133.394.798-.15.265.133.522.392.223.308-.059.406.355.588-.131-.098.359.663 1.472.521.308.33.579-.036 1.059.267.907.4.416-.257.773.718.682-.422.606.522.27-.018.679.959.194.141.502.279-.021.488.47.3.99-.265.789.22.082.114.608-.15.623-1.784 1.046-.69-.428-.227-.382-.051.168-.489.022-.23.506-.833-.116-1.021.643-1.028-.333-.074.69-.557.488-.212-.039-.516-1.135-.303.316-1.216.184-.473-.369-1.841.602-.408.322-.318-.218-.417.014.174-.516-.145-.478.985-.865.496-1.165-.263-1.4-.533-.894-.224.063.069-.616-.494.124-.179-.383-.72.183-.905-1.536-.348-.174.503-.669.06-.472.598-.16.367-.707-.288-.318-.308.214-.241-.073-.06-.872-.51-.355-.28.086-.476-.66.383-.322.029-.267.292-.474-.076-.155-.767-.069-.314-.537.085-.206.476.053.118-.269.5.002-.05-1.43-.238-.2.605-.54.026-.248.433-.201-.517-.422-.2-.602.688-.573.323.469.469-.094.11-.182 1.18.005.27-1.643.548-.186.422-.384zM64.179 24.093l.911-.578 1.093.543.262-.626.622-.176.806.433.068.518.853.149.275-.351.453.118.963.313.506.775-.07.257.43.939.206-.222.322.016.292.396-.27.043-.24.543-.317-.066-.516.804.245.327-.198.459.55.343.109.808v.504l-.375.488.069.19.96 1.153.508-.072-.307-.618.1-.202 1.088.17.4.807-.233.504.062.292.834 1.267.12.494-.067.24-.502.258-.161.231.108.15-.457.409.95.569 1.577.078-.2.269.124.135-.306 1.257.678-.006.642-.524.33.134-.062.653-.353.47.1.467-.021.58-.475.23-.155.47-.386-.058-.127.388-.485-.22-.6.25-.621-.097-.218.62-1.24-.031-.872.19-1.578-2.371.178-.259-.325-.321-.34-.038-.249.444-.913.376-.326.531-.77.455-.322 1.104-.4.165-.251-.259-.786-.084-.032-.383-.37-.343-.22.06-.282-.199-.463.267-.145.508-.806-.565-.218.063-.553-.4-.312-.814-.329.004-.125-.232-1.51-.021-.204-.084-.067-.424-.437-.28-.255.094-.231-.422.343-.459-.3-.049-.234-.666.167-.185.498.126.173-.12.404.279.456-.242-.447-.804.83-.57.345-.592-.345-.145-.159.411-.147-.306.07-.268.344-.212.125-.449.547-.255.263-.388.828.016 1.08-1.506.727-.528-.117-.441.33-1.453-.305-.228-.02-.607-.39-.185.373-1.74-.147-1.772-.496-.539.063-.549zM78.974 70.589l-.122.231-.08-.27-.316.078-.198-.441.396-.543-.102-.141.455-.412.263.255.325-.234.004-.437-.986.263-.48-.959.382-.267.002-.306-.257-.502-.579-.531-.458.18-.161.344-.867-.379-.157.143-.431-.17-.159.164-.423-.264.066.44-.33-.205-.285.302-.022-.133-.594.09-.234-.128-.243.089.102.32.018.34.204.12-.222.157.116.314-.475.168-.055.224.665.564-1.078.912-.386-.372-.26.86.45-.054.221.231.183.25-.294.554.211.069-.243.478-.314-.127-.06-.35-.19.15.195.931-.517.46.849.603.096.282.908.216.225.218.077.24-.284.595.43-.557.652.614.343-.01.022.284.672.308.506-.21.27-.398.189.082.437-.568.316-.365-.273-.237.851-.531-.113-.02.192-.186-.165-.012-.094-.355.317.076-.125-.182.282-.014.222-.304.51-.029.772-.51-.158-.278-.724.08-.396-.488.665-.614-.151-.186zm-2.22 2.23l-.065.12-.582.11-.241.454.306.578-.355.132-.365-.538-.208.141-.623-.29-.442-.462-.525-.09-.151-.616.66-.032-.04-.25-.461-.27.033-.433.298-.137.05-.322.595-.264.726-.041.139.954.88.138-.268.417.849.279-.21.421z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M81.583 64.727l.275.815 1.772-.031.267.4.437.165.208-.28.414-.03.165-.308 1.42.692-.048-.245.31-.418 1.163.634-.159.627.455.167.057-.124.531.206.169-.378-.585-.232.063-.394.677-.111.096.364.69.508.606-1.069.535.04-.067.198.506.294.451-.25.036.154.886.137.25.018.02-.204.726-.01 1.684.343 1.52-.249.547.078.05.228-.087.616.147.347.698.496h.398l.653.66.157.416-.27.804.47 1.041.522.483.221.806-.886 1.147-.273.7-2.045-.698-.388.73-.3-.044-.135-.218-.197.185-.315-.357.131-.096-.163-.265.263-.208-.492-.386-.937-.27-.067-.634-.912-.143-.084-1.49-.153-.08-.155.003-.04.369-.246-.03-.092.824-1.598.037.017-.166-.41-.199-.088.54-.81-.089.006-.356-.202-.032-.172.438-.444-.093.052-.258-.216-.122-.088.5-.877-.294-.072.321-.571-.029-.012-.445-.766.064.023-.42-.924.023-.786.252-.014-.178-.65.153.027-.176-.177-.03-.304.341-.427-.168.053-.56-.228-.017-.1.457-.47-.12-.173-.18.051-.443-.455-.16.093-.254-.183-.114-.886 1.342-.588-.212-.383-.614-.43-.286-.572.61.386.049-.64.484-.152-.177-.121.232-.083-.27-.315.076-.198-.44.396-.543-.102-.143.455-.412.263.255.325-.233.004-.437-.986.262-.48-.958.382-.267.001-.306-.256-.502-.579-.531.432-.487.039.267.33-.067.429.257.758-.766.465.317.392-.353.19.126.35-.594.52-.345zM91.67 14.897l.315.035-.135.288.184.057-.016.353.322.122-.157.104.092.178.198-.094-.157.353.231.404.261-.045.157.194.122-.233v.306l.272-.08.026-.193.27.475.165-.022-.255.582.408.453-.2.638.175-.083-.124.169.202.082.09-.135-.017.455.266.149-.423.23.225.201.073-.215.01.217.198-.168.31.482.084-.155.282.153.047-.182.086.462.257-.086-.015-.196.308.094.1.35.137-.01-.036.23.173.136-.186.006.17.127-.143.16.512.429-.11.276.16-.06-.046.317.202.014-.075.353.196.13-.34.252.193.151-.235.014.806.108.086.198-.139-.11-.123.267.374.243.169-.087.315.638.751.296-.159.143.63.25.022.177.645.065.066.208-.162-.104-.108.159.831.578-.235.298.253.29-.22.189.386.294-.362.359.374.163.057.276-.235.141.294.247-.09.212-1.277.13-.274-.05-.179-.3-.51-.056-.22.13.318.575-.215.03-1.024-.832-.355-.03-.01-.34-.864-.032-.938-1.462-.596-.389-.253.495.043.725.177-.053.202.4-.57.212-.95-.163.116.357-.594.057-.035.335-.234-.282-.731.017-.292-.26-.704.172-.012.206-.265.13-.166-.255-.94.05-.302-.215-.159-.537-.821-.661.159-.27.233.025-.018-.208.424-.516.257.23.478-.312-.727-.5-.147-.888-.463.053-.233-.212-.75.074-.327.83-.388-.045-.341-.673-.155.579-.91.33-.879-.172-.174-.498-.737-.786-.51.276-.318-.386-.563.48-.278-.933.159-.139-.218-.951-1.082-1.131.614-.724-.144-.349-.525-.406-.157.065-.245-1.104.392-.173.198.416.39-.018.534.434.821-.05-.125-.184.141-.206-.431-.4.45-.256-.129-.26.141-.78.238-.413.44.01-.091-.383.231-.163 1.286.488 1.936.07.549.962.286-.53.202.073-.033-.72.264-.896.569.465.296-.284.037.31.718-.018.498-.179-.196-.484.116-.13.368.132.432-.33.88-.195.155.127zM23.165 69.223l.064-.138.461.273.406-.431.35.478.328-.08.151.288.169-.124.194-.87-.463-.394.24-1.37.368-.044.196-.292-.1-.542.202-.488.738.596 1.698.083 1.117-1.753-.002-1.195.322-.298-.32-.229.857-.724 1.316-1.654.34.086.295.566.765.199.751.62.28.564.277-.01.221.265.065.221-.325.389.455 2.153.423.298-.131.311.206.144.184-.218.143.069.394.725.763.322.01.325.312.28 1.755.308 1.121.489 1.22.733-.134.322.68.386-.16.492-.331.286-.26-.231-.264.176-.245-.145-.208.236-1.076-.03.294.451-.49.106-.006.188-.514.302-.147.679-.33-.022-.088.17 1.102.607.034.24-.64.095-.147.657-.586.131-.33 1.047-.319.093-.022.205.477.25-.232 1.482-.797-.316-.732.753-.137.426-.628-.114-1.435-.91-.786-.745-.845-.251.011-1.13-1.533-.511-.455-.661-.292-1.328-.496-.57.066-.455.673.117.375-.176.21-.94.258-.274.54.01.856.584.793-.37-.038-.479-.582-.698-.461-.276-.874-.035-1.642-1.681-.231-.045-.504.212-.331.423-.644.063-.34.23-.48.7-1.148 2.572-.477.175-.866-.473-.138-.545-.412-.277-.135-.878-.217-.231zM42.964 6.917l.62-.09.659.457 1.421-.202.563.314.308.711.237.15.208-.185.753-.098.141-.288.708-.082.3.337.375-.063.417.284.22.426 1.016-.06.462.391 1.22-.55.318.213.408-.22.147-.51.529-.31.959.358.79-.32.34.424.356-.075.114.478.469.538-.024.588.388.208.041.237.385-.043.21.249.18-.169.218.269.562.092-.084.267.182.476.522.514.088.551.769-.098.078.524.379.127.984.914-.082.16-.555.12-.763.698-.663-.12-.423.181-.202-.222-.426.198-.072.406-1.077-.047-.631.345-.583-.288-.911.147-1.26-.592-.895-.188-.375.63-.684-.062-.318.904-.347.197-.102.307-.557-.135-.896.131-.259 1.375-.427.312-.19.568-.324.093-.143.247-.282-.124-1.206.251-.253-.292-.361.008-.294.4.133.237-.47-.186-.585.243-.62-.014.032-.35-.343-.028-.169-.422-.316-.174-1.086.368-1.606-.274-.447-.277-.633-.064-.03-.251-.282.02-.151-.281-1.173-.196-.015-.188-.512-.185-1.045.567-.265-.328-.76.338-.64-.263-.031-.89.392.096.188-.204.443.053.096-1.22 1.14-1.316.553.789.449.121.413.398.383-.011.155-1.673.468-.075.745-.682-.125-.131-.159.11-.35-.514-.442-.008-.173-.279-.657.073-.09-.496.369-.835.25-.061.86.376.366-.092.926.386.357-.372 1.014-.43.44-.833.24.077.39-.406-.215-.483-.442-.184-.349-.8-.28.018-.553-.479.365-.96.472.303zM62.023 23.188l.353.317.58.045.404-.227.818.77-.063.55.496.539.147 1.77-.372 1.742.39.184.02.608.303.227-.33 1.453.119.441-.728.528-1.08 1.506-.828-.016-.263.388-.547.255-.125.45-.343.211-.07.269.146.306.159-.412.345.145-.345.592-.83.57.448.805-.457.24-.404-.278-.173.12-.498-.126-.166.185.233.666.3.05-.343.458.231.422.255-.094.437.28.067.424.204.084 1.51.022.125.231.33-.004.311.814.553.4-.274.165-.124.364-.543-.239-.496.212-.557-.133-.77.684-.147.54-.336-.046-.376-.502-1.045.306-.355-.165-.114.27-.48-.03-.177.195-.382-.182-.167-.27.157-1.671-.016-.43-.243-.339.16-.221-.105-.628-.337.1-.238.447-.325.08-.433-.248-.846.337-.133-.26-.782-.09-.588.356-.948-.218-.45.016-.179.206-.425-.367-.275.04v-.289l-.669-.351-.168-.678-.667-.004-.916-.661-.127-.286.306-.324.2-1.012-.241.028-.271.423-.31-.014-.143-.423-.055-1.128.404-.45.492.148.018-.41.49-.93-.614-.181v-.24l.53-.513.5-.063.22-.515.025-.226-.55-.275-.174-.382 1.569-1.023-.088-.189 1.455.916.743-.153.18.188.698-.46.373.174.216-1.14.447-.195-.022-.242.273-.023.11-.96.343.029-.087-.195.367-.02.143-.48.318-.011.04-.212.395.737.618.234.31-.07.029-.256.184-.035-.278-.232.22-.827.378-.367.251-.84.412-.538.782-.612.66.023.234-.29.889.094.588-.459z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M69.522 24.122l.094-.563.36-.433.042-.484.296-.143-.094-.428.279-.331.854-.073.33-.58-.824-1.236.122-.12.79.173.76.938.21.035.261-.306.573-.208 1.151.214.588-.341.836.09.125-.202.763.408.23-.361.405.063 1.312-.826.445.2.159.488.975.883 1.082 1.131.218.951-.16.14.28.933.562-.48.318.386.51-.277.737.786.174.499.879.172.91-.331.154-.579.342.673.388.045.327-.83.75-.074.233.212.462-.053.147.888.728.5-.479.312-.256-.23-.424.516.018.208-.234-.025-.158.27.821.661.159.537-.135.173.372.435.047.586-.056.883-.255.184-.26.037-.313.426-.063-.326-.357.071-.298-.451-.404.259-.215-.235-1.238.292-.135-.53-.184.177-.094-.34-.263-.068.188-.022.094-.396-.58-.194-.008.386-.22.14-.062.443-.373.264-.123.53-.389.116-.484-.953-.096.29-.628-.059-.149.66-.88.542-.531.627-.396-.445-.29-.039-.226.265-.688.02-1.1.682-.657-.238-.387-.888-.37.224-.308.686-.708.216-.198-.316-.502.21-.284-.177-.098-.864-.906.043-.265.225-1.088-.17-.1.202.308.617-.508.073-.961-1.153-.069-.19.375-.489v-.503l-.108-.808-.551-.344.198-.458-.245-.328.516-.804.317.067.24-.543.27-.043-.292-.396-.322-.016-.206.222-.429-.94.069-.257-.506-.774-.963-.314zM47.551 70.586l.933-.123.346.123-.032.208.198-.131-.057.29.242.25.392.007.653-1.204.46-.096.28.241.495-.059.063-.366.576-.05-.041-.362.577.402-.23-1.618-.478-.574.084-.955.145-.424.28-.035.01-.965.357-.288-.106-.337.73-.271.186-.235.222.14.066.736.151.141-.157.357.81-.06-.016-.457.422-.785.247.016-.004.631.379 1.02.182.053.065.77.392.414 1.053-.047-.016.43-.239.282.547 1.54-.173.382.177.258.057.746-.155.615.176.59-.039.928.273.384.631-.011.086.162.255.853.232.224-.245.157-.04 1.278-.129.088.284.118-.555.624.118.564.496.455.131.645-1.739.62.151.353-.821.155-.983.486.306.643.259.065.04.318.18.064-.19.15.313.382.041.357.804.986-.49.247.902.045-.404.222v.313l-.386.089-.118.413-.37.12-.051.484-.747-.466-1.15-.198-1.239.47-.818.68-1.96.252-.518-.128-.412-.365.216-1.28 1.023-1.304.275-1.216-.122-.086.128-.177-.3-.27.069-.177.221.061-.125-.196.113-.325-.472-.455.533-2.663-.278-.053.188-.67-.131.005-.128-.425-.322.06-.415-.507-.57-.204-.026-.345-.871-1.032.108-.259-1.05-.294.173-.46-.278-.122-.21.233-.617-.6.097-.4-.39-.178.485-.49-.14-.242.47-.355zM66.863 54.275l.166-.257.485-.19 1.121.08.202-.27.504-.175.993.28.056.175.769-.32.288.236.218.605.482.134.255-.379.167-.943.284-.31.922.01.633.63.128.107-.069.683.757.498.453.794.635.202.465.56-.018.28-.264.164.021.33.2.037.498 1.3.543.047.328-.3.31.066-.17.342.272.615.892-.447.457.57-.26.797.181.178-.237.5.168-.023.503 1.508.439-.214.323.635.196-.115-.02.5-.73.443 1.174 1.088-.52.345-.349.594-.19-.125-.392.353-.465-.318-.759.767-.43-.257-.329.067-.039-.267-.431.486-.459.179-.16.345-.868-.379-.154.143-.432-.17-.159.163-.423-.263.067.44-.33-.207-.288.3-.022-.133-.594.09-.231-.127-.243.088.104.32-.212-.008-.3.398-.23-.404.512-.463-1.006-1.447-.48.192-.598-.623.32-.383-.136-.418.212-.21-.54-.682-.372.089-.182-.312-.438-.069-.22.165-.068-2.133-.784-.628-.237-.694-.402-.257-.047-.41-.404-.031-.112-.62.155-.614.266-.221-.035-.306-.292-.404-.81-.463.198-1.033-.149-.64-.233-.256zM51.694 39.704l.178-.206.451-.015.947.217.589-.355.782.088.134.261.845-.337.433.249.325-.08.238-.448.337-.1.106.628-.16.222.242.339.016.43-.157 1.67.167.27.382.183.176-.196.48.031.115-.27.355.164 1.045-.306.376.502.336.045.039.232-.702.396-.314.631-.392.085.03.498-.838.078-.202.751-.451-.22-.231.116.21.78.73.628-.056.408-1.04.082-.737.58.604 1.66.116 1.972-.198.128-.71-.09-.653.382-.772-.104-.2.204-.534-.269-.18.15-1.06-.093-.542.32-.237-.063-.35.52-.356.007-.35.336-1.09.025-.429.237-.81-.411-1.241-.04-.635.194-.257-.21-.712.063-.655.518-.482.067-.512.62-.445.105-.002-.123.349-.106-.078-.865-.189-.506-.323-.29.133-.416.353-.247-.173-.233.14-.435-.73-.647-.033-.51.135-.414.508-.202.184-.367.269-.084-.555-.457.153-.337.724-.408.368.076.263-1.162-.233-.19.143-.283-.12-.108 1.051-.139.273-.457.368-.22-.096-.354.143-.379-.257-.168.536-.585.91.002.494.792.012-.284.507-.308-.088-.372.345-.461-.074-.173.396-.258.33-.58.446-.034.78-.394.044-.171-.345-.278.212-.516-.11-.165.743-.443zM37.022 17.805l1.045-.567.511.185.016.188 1.173.196.15.28.283-.02.03.252.633.064.447.277 1.606.274 1.086-.368.316.174.169.422.343.027-.032.351.62.014.584-.243.47.186-.572 1.02.279.718-.822-.565-.141.398-.222.108-.094-.167-.833.631-.324.497.073.252-.38.299-.532-.306-.18.464-.743.07.198.58-.022.19-.292.049.059.347-.694.017.543.626.153.56-.202.058.055.178-.375.437-.502-.027-.078.145.16.031-.372.143.025.177-.172.041.15.31-.59.682-.156-.07-.28.202-.22-.204-.257.045-.406-.922-.263.163.096 1.104-.266.416-.524-.055-.686.349-.347-.138.206-.55-.336-.265-.316.431-.105-.392-.236.235-.135-.312-.463.1-.353-.223-.19-.422-.304-.135-.02-.569.157-.211-.402-.104-.256-.365-.916.18-.8-.11-.045-.67-.308.086-.135-.23-.663-.086-.326-.537-.411.098-.304-.643.149-.217-.332-.33-.088-.537-.318-.012-.143-.19.235-.214.11-.655.314-.194.09-1.404.7-.292.002-.345.202.031.28-.52.444-.054.412-.51 1.043-.17.25.256.424-.433.618.349.353-.08-.11.378.273.01.25.502.258.139.464-.22.543.177.694-.818-.15-.498z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M37.903 4.701l.31.43.688.094.259-.136.312.512-.138.34.706.325-.045.333.853.347.194.26.247-.03.216.257.622.14.553.48.28-.018.35.8.44.184.216.482-.39.406-.24-.076-.44.833-1.014.43-.357.372-.926-.386-.366.092-.86-.377-.25.061-.369.836.09.496.657-.073.173.279.441.007.351.514.159-.11.125.132-.745.682-.469.075-.154 1.672-.383.012-.413-.398-.45-.122-.553-.788-1.139 1.316-.096 1.22-.443-.054-.188.204-.392-.096.031.89.64.263.76-.337.265.328.15.498-.693.817-.544-.176-.464.22-.257-.14-.251-.502-.273-.01.11-.378-.353.08-.617-.349-.424.434-.251-.257-1.043.17-.412.51-.443.055-.28.52-.203-.032-.466-.462-.118-.447-.384-.05-.163-.46-.44-.218-.656.282-.31-.256-.614.121-.302-.988.183-.151-.76-.353.003-.612-.433-.01.06-.457-.262-.086-.198-.545-.48-.23.51-1.523.39-.157.076-.596.662-.235.008-.451.486.331.948.157.235-1.176.425-.132.857.722.77.008.891-.298.402-.889.806-.139-.233-.937.443.025.659-.33.535-.805.826-.304-.13-.592-.235-.157.11-.237.554.14.548.403.227-.265.745-.037.202-.563-.037-.586.23-.216-.116-.182.676-.62zM74.912 7.282l.541.994.731.245.02.525.175.167.378-.314.535.441.14.397.153-.13.204.279-.104.257.294.08-.075.314.694.843.406.186-.2.286.073.212.296.133-.018.153.379-.008.131.48.131-.093-.031.16.265.114-.036.355.802.414-.147.08.218.553-.184.2.05.293.224.074.23.812.335.059-.01.215-.647.245.494.32.02.6 1.11-.24-.142.781.13.26-.451.256.431.4-.14.206.125.184-.822.05-.533-.434-.39.017-.199-.415-.392.172.245 1.104.157-.064.526.405.143.35-.614.723-.975-.882-.158-.488-.445-.2-1.312.825-.406-.063-.23.361-.762-.408-.126.202-.835-.09-.588.341-1.151-.214-.573.208-.26.306-.21-.035-.761-.937-.79-.173-.122.12.823 1.235-.329.58-.855.073-.278.331.094.428-.296.143-.041.484-.361.434-.094.562-.453-.117-.275.35-.853-.148-.069-.518-.805-.433-.622.176-.263.626-1.092-.543-.912.578-.817-.77-.404.227-.58-.045-.354-.318-.117-1.151-.248-.165.253-1.02-.302-.527.528-.443-.198-.755.082-.306-.358-.149-.416-.56.006-.263.143-.242.213.179.314-.114.096-.425-.262-.244.558-.486-.61-.402-.348-.563.127-.298-.733-.602-.251-.021.762-.698.555-.12.083-.16-.985-.914-.378-.128-.078-.523.682.066.133-.168.402.168.192-.407.169.098.618-.246.206-.468.423-.228.018-.333.682-.937.13-.622.49-.018.549-.403 4.24-.665 1.617.202 1.086-.577.382.175.32-.314.467.122 1.415-.332.232.083zM63.863 72.066l.478.623.665-.204-.057-.114.869-.794-.216-.739.551-.055.314.224.233-.043.214.139-.23.347.297.17.274.365-.212.451.61.441-.345.377.12.15-.275.358-.047.466 1.31.26.235-.116.479.23-.112.252.357.231.102-.325.155.049.015.41.318.249-.386.806-.11.766.74.645-.34.112-.151.457-.196-.367-.051.332-.184-.09-.306.496.178.425-.445.118.114 1.17.165.202-.16.092.244.385-.09.98-.234.18.296.452-.037.294.42.155.243 2.296-1.428.802-.947.016-1.28.421-.483-.143-1.104-.943-.94-.304-.964.253-.56-.114-.869-.65-.72.015-.817.392-.863-.096-.888.46-1.07-.715.05-.484.37-.12.118-.414.387-.088v-.314l.404-.221-.902-.045.49-.247-.804-.987-.041-.357-.314-.382.19-.149-.18-.065-.04-.317-.258-.065-.306-.643.982-.487.822-.154-.151-.353 1.739-.62-.131-.645-.496-.455-.118-.565.555-.623-.284-.118.129-.088.04-1.279.244-.157-.231-.223-.255-.853.349-.126.222.218 1.343-.1.437-.435.96.067 1.8-.808zM43.785 53.839l.002.123.445-.106.512-.62.482-.066.655-.517.712-.063.257.21.635-.194 1.241.039.81.411.43-.237 1.09-.025.349-.336.357-.008.349-.52.237.064.541-.32 1.061.092.18-.149.534.269.043.747-.712 1.13.398 1.611.324.182-.065.561-.2.163.23.043.111.54-.406 1.2.669.878-.04.333-.2.132.242.372-.11.45-.296-.018-.012.268.19-.006.087.214-.314.29.359.347-.251.714.14.228-.471.864.254-.025-.272.659.13.268-.59.86-.068-.736-.221-.141-.186.235-.73.27.106.338-.357.288-.01.965-.28.035-.145.424-.085.955.479.574.23 1.618-.577-.402.041.363-.576.049-.063.366-.494.06-.28-.242-.462.096-.652 1.204-.393-.008-.24-.249.056-.29-.198.131.031-.208-.345-.123-.933.123-.194-.864-.253-.14.084-.676-1.076-.275-.196-.204-.146.324-.102-.5-.182-.094.116-.414-.141-.36.237-.646-.09-1.172.276-.361-.269-.65-.25-.027.174-1.435-.186-.737.023-.212.342-.192.417-1.045-.023-.985.517-.347-.75-2.014.617-1.243-.686-.407-.828.439-.53-.08-.55-.367-.236.302-.417-.34.149-.623-.114-.608-.22-.082.265-.789.457.077zM79.409 43.343l1.621.373 1.126-1.006.996-.292 1.088.44.694-.26.761.353.73-.91 1.135.506.096-.521.62.22.137-.124-.118-.124.11-.264-.28-.053-.026-.216.61-.414.021-.217.306.202.224-.346.468.228.228-.145-.094-.353.453.133.227-.117.104.554.592.257.267-.61.459-.001.26.105.142.473.28.245.012.27-.104.328-.584-.431-.102.082.07.812-1.588.208-.257.374.035.298-.688.373v.416l.251.933.667 1.353.369 1.431.36.47.06.71.776 1.08.325-.156.208.75.255-.07.065.309.29.06-.198.246.22.039.262.413-.33.097-.06.274.306.26-.1.376.259.325-.2.178.253-.01.108.238-.777.743-.047.335-.757.353.055.198-.418.302-1.17.061-.087.153-.382-.284-.086-.685.17-.615-.462.43-.236.044-.26-.249-.536.416-.476-.426-.212.03.22-.443-.187-.094-.476.396-.514-.157-.753-1.38-.325.113-.487-.141-.157.19-.778.075-.531-.546-.577-.015-.59-.694-.406.06-.38-.843-.553.21-.267-.241-.383.057-.956-1.296.058-.293-.488-.343.073-.708-.641-.439-.232-.341.177-1.059-.14-.467.23-.339-.037-.66.604-.581v-.979z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M89.05 27.92l.303.215.939-.05.167.254.264-.13.012-.205.704-.173.292.261.732-.017.233.282.035-.335.595-.057-.116-.357.949.163.57-.212-.201-.4-.177.053-.043-.726.253-.494.596.388.937 1.463.865.032.01.339.355.031 1.023.832.216-.03-.318-.574.22-.132.51.057.178.3.275.05 1.276-.13.004.474.112-.049.096.357.555.45-.184.07.3.296-.138.165.094.29.171.012-.104.182.288.23-.015.464.151-.082.115.315.079-.131.225 1.273-.249.474.112.088-.229.036.162.494-.251.268.189.148-.261.439.261.21-.077.298.222-.008.043.292.155.017-.22.197.257.255-.145.411-.251.051.104.128-.169.114.224.09-.32-.006.077.141-.31.253.108.29-.298.083.19.148-.167.22.298.222-.072.184-.314.194.014.267-.073-.232-.067.279-.247-.18.039.243-.18-.095-.145.416.243.202-.461.136.01.725.163-.141-.079.343.232-.05.068.22-.123.012.159.069-.194.01.172.245-.208.165.11.46-.231.353-.492-.111-.73.229-.182-.25-.324.174-.176-.58-.334.1-.356-.322-.46.19-.015-.44-.327.16.011.36-.25.365-.695.137-.243-.392-.54.053-.303-.167-.28.226-.987-.424-.068.285.201.207-.176.044.518 1.074-.28.123-.01.654-.367.24-.441-.315-.318-.59.22-.226-.177-.292.06-.584-.207-.292-.34-.02-.01-.27.332-.775-.256-.182-.21-.834-.14-1.145.224-.394-.349-1.318-.355-.45-.496-1.599-.684-1.349-.667-.718.492-.517-.23-.385.222-.427-1.506-1.184.255-.185.057-.882-.047-.586-.373-.436.136-.172zM78.807 47.768l.641.439-.072.708.488.343-.06.292.958 1.296.382-.057.267.241.553-.21.38.844.406-.061.59.694.577.016.531.545.779-.075.157-.19.486.141.325-.113.753 1.38.514.157.477-.396.186.094-.22.443.212-.03.477.426.535-.415.26.249.236-.046.463-.429-.171.616.086.684.383.284.086-.152 1.17-.061.418-.302.083.333-.512.233.106.367-.373.233.126.747-.241.106.039.242-.54.223.2.102-.14.23.174.129-.196.257-.173-.147-.472.447-1.5-.777-1.206 1.432.266.292.743-.447.251 1.274.471.128-.112 1.163.534.055.047.53.4.042.033.663-.416.02-.111.386.284.094-.296 1.067-.322-.108-.043.127.263.204-.184.816-.342.012.273.282-.677.112-.062.394.584.231-.169.379-.531-.206-.057.123-.455-.166.159-.628-1.163-.633-.31.417.047.246-1.42-.693-.164.308-.414.03-.207.28-.438-.165-.266-.4-1.773.032-.275-.816-1.174-1.088.731-.443.02-.5-.196.115-.324-.635-.439.214-.502-1.508-.169.023.238-.5-.18-.178.258-.796-.457-.57-.892.446-.27-.615.168-.342-.31-.066-.327.3-.543-.047-.498-1.3-.2-.038-.022-.33.265-.164.017-.278-.464-.561-.636-.202-.453-.794-.757-.498.07-.683-.128-.107.598-.67.568-.08.542-.917.086-.624.349-.24.41.025.437.605.398-.415.228-.385.272-1.692.457-.227.053-1.192zM46.473 19.497l-.133-.238.294-.4.36-.007.253.292 1.206-.251.283.123.068.718-.586.472-.412-.266-.268.245.104 1.894.174.292.482.043.18.273.012-.204.187-.04.237.39-.047.344.249.263.584-.108.483.879-.475 1.039.226.159-.161.333.123.712.463.082.14.524.417-.032.01.257.569.526-.328.078-.049.87-.276.156-.087.494.088.188-1.568 1.024.174.382.55.274-.026.226-.22.516-.5.062-.53.514v.24l.615.18-.49.931-.018.41-.492-.149-.404.451.055 1.127-1.302.26-.32-.054-.088-.292-.234-.064-1.074.27-.357-.074-.378.282.1.269-.303-.032.318.38-.514.114-.606-.17-.107-.18.068-.49.379-.47-.292-.404-.746.228-.388-.255-.217.075-.361-.493-.916-.553-.353.05-.259.356-1.259.683-.621-.12-.067-.259-.27.034-.687.306-.188.43-.563-.01.083-.48-.218-.103-.084-.604-.255-.326-.926-.09-.755.345-.65-.172-.258-.328.138-.712-.165-.537-.243.077-.038-.271-.48-.345-.423-.07-.4.307-.4-.316.433-.264.425.135.38-.357-.5-.921.064-.338-.712-.34.159-.436.7-.27.702-1.471-1.257-.84.002-.558.54-.679.8.11.917-.18.256.364.402.104-.156.212.02.569.303.135.19.421.353.224.463-.1.135.312.236-.236.105.393.316-.432.336.265-.206.55.347.138.686-.349.523.055.267-.416-.096-1.104.263-.162.406.921.257-.045.22.204.28-.202.157.07.59-.682-.151-.31.172-.04-.025-.177.372-.143-.16-.032.078-.145.502.028.374-.438-.054-.178.202-.057-.153-.56-.544-.626.695-.018-.06-.347.293-.049.022-.19-.199-.579.744-.07.18-.465.531.306.38-.298-.072-.253.324-.496.833-.631.094.166.222-.108.141-.398.822.565-.279-.718.573-1.02z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M93.585 53.495l.132-.142.457.136.147.398.582-.522.04.351.366-.168-.075.339.4.04-.076.21.26-.066.016.173.232-.092-.098.6.5-.142.04.255.385.236.638-.04-.087-.098.341-.323 1.257.531.12-.18.449-.047-.024.804-.382 1.276.782.61.475.088.259-.15.188.43-.486.795 1.337.967-.353.237.077.39-.508.004.21 1.17-.308.379.288.74-.345 1.072.229.404-.521.476-.34 1.1-.507.704-.457.038-.602-.353-.914.337-.05-.228-.546-.078-1.52.249-1.684-.343-.726.01-.021.203-.25-.017-.886-.137-.035-.153-.45.249-.507-.294.067-.198-.535-.04-.606 1.069-.69-.508-.097-.365-.272-.282.341-.012.184-.816-.262-.203.043-.128.321.108.296-1.067-.284-.094.112-.386.415-.02-.033-.663-.4-.04-.047-.532-.533-.055.111-1.163-.47-.127-.251-1.275-.743.447-.267-.292 1.206-1.431 1.5.776.473-.447.172.147.196-.257-.174-.13.14-.228-.2-.102.54-.224-.04-.241.242-.106-.125-.747.372-.233-.106-.367.512-.233-.082-.334-.055-.198.757-.353.047-.335.776-.743zM82.981 2.316l.842.113.312-.223.294.533.258-.139.43.596.286.004-.194.182.137.206.218-.025-.073-.316.371.07-.13.565.724.267-.147.14-.318-.142.057.341.526.214.227-.304.067.26.18-.109.014.508-.177.269.683.68.055.304.253.053-.151.482.396-.137.021.408.479-.01-.257.516.45.402-.344.488.62.359.137.996.494.306-.184.174-.157-.14-.077.262.324.043-.114.337.214.069.049.312.159-.036-.016.373.192-.084.002.28.231.004-.22.233.132.28-.325-.188-.196.238.415.364-.125.2.29.17-.022.33.265.393.565.413.392.569-.88.196-.432.33-.368-.132-.116.13.196.484-.498.178-.718.018-.037-.31-.296.284-.569-.464-.264.896.033.72-.202-.073-.286.53-.55-.963-1.935-.069-1.286-.488-.231.162.092.383-.441-.01-.238.414-1.11.239-.02-.6-.493-.32.647-.245.01-.215-.336-.06-.23-.811-.223-.075-.05-.292.184-.2-.218-.553.147-.08-.802-.414.035-.355-.264-.113.031-.161-.131.094-.132-.48-.378.007.017-.153-.296-.133-.072-.212.2-.286-.406-.186-.694-.844.074-.313-.294-.08.104-.257-.204-.279-.153.13-.139-.397-.535-.44-.379.313-.174-.167-.02-.525-.731-.245-.541-.994.333.096 1.082-.398.245-.967.785-.592.304-.98.462-.485-.092-.373.251-.22.163.099.216-.23.106.208.174-.03.718-.335.174-.27.745.204.295-.308.258.108.067-.451.55.068-.056-.207.177.058.05-.202.236.183.149-.218.035.316.455-.357.186.316z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M118.983 65.987l-.373.104.608-.355-.235.251zm.306-.317l.4-.665.019-.647.022.635-.441.677zm-16.381-11.16l-.051.524.833 1.379 2.716 1.298.974.096.906.343 1.028-.322-.514-.725.647-.357-.218-.508.434-.09 1.545 1.002.316-.924 2.362-1.035 1.116-.81.63.106.437-.382.363.204.974-.108 1.52.61.629.43.734.93.264 1.134-.213.486.278.612-.663-.098.006-.155.016.616.229.531.389.086.405-.153-.411.345-.308.85-.459 3.821-.269-.006.106.726-.727.41-2.596.28-.142-.169-.337.108.302.085-2.386.549-.824.5-.91.994-.296-.351-.174-.645.663-.04 1.286-.654.29-.642-.686-.931-.11.241.188.384-.384.238-.324-.498-.064-1.406.084-.2.684-.25.026-.388-.739-.386-.397-.004-.066-.308-.588.07.072.373-.202.161-.231.012.17-.38-.237.233-.063-.184-.039.327-.337-.73.212.742-.593.431-.117.837.102.551 1.163.999-.546.372.212.061-.155.36.351.422-.81.16.175-.199-.804.533-.559.161.29-.213-.278.049-.131.347-.438-.1-.327-.326.117.37.716.105-.145.21.484.113-.384.23-.288.064-.259-.355-.365.089.026.374-2.053.057-.045.357-.644.14-.162-.517-.265.038-.037.182-.349-.059-.049.165-.377-.088.134-.393-.824-.105-.127-.273-.899-.457.022-.798-.496-.014-.247.208-.259-.17.153-.304-.498-.345-.492.125-.522-.159.339-1.1.522-.476-.231-.404.347-1.073-.29-.739.307-.38-.211-1.171.507-.004-.074-.39.351-.237-1.335-.965.484-.796-.188-.432-.259.151-.475-.088-.782-.61.38-1.276.024-.804.855-.661.527.072.657.416.098-.659.269-.296.719.242.189.449zM5.255 41.407l.531.41.212-.445.267.133.245-.272.231.025.15.277.562.004.102.337.677.643 1.07.275.324.649.514-.108.543.257.547-.177.196.738.321.37.402-.29.075-.335.198-.014.35.5.72.302.214-.557.418-.108-.084-.237.535.308.176.455.173-.01.18-.457.771-.36.857-.824.322.46-.051.577 1.415.692-.014.483.352.192.103.547.28-.153.022-.39.406-.579.147.363.469.05-.002.217.282.039.406-.528.23.216.302-.269.284.204.326-.24.154-.403.889-.206.062.461 1.563.659.047.349.522-.192.549.227.314-.643.776.324.224-.71.239-.014.13.514.77.47-.03.267-.382.322.477.66.278-.086.512.355.059.873.24.072.309-.214.288.318-.367.708-.598.159-.06.472-.503.67-.298.3-.158-.209-.602.22-.304-.214-.651 1.433-1.35-.837-.325.6-.4.083-.398.366-.131-.157-.226.145.126 1.063-.347.46-.68.017-.432-.187.182-.42-.166-.262-.5.137-.128-.15.208-.503-.467.089-.021.437-.497-.086-.884.172-.241-.427-.494-.143-.167-.338-1.204.228-.388 1.125-1.333.534.14.782.256-.067.215.253-.827.175.102.555.35.498.413.202.125.447.394.421-.013.4-.234.142-.298.83.075.285-.436.194-.606-.252-.362-.442-.165.185-1.296-.438-.214.228-.716-.377-.547-1.337-.174-.008-.2.347-.606.165-.2-.38-.25.015.019-.272-.573.131-.077-.306-.639-.445-.15-.34-.218-.017-.14-.537-.72-.265.224-.247-.174-.335-.436-.275-.792-.002-.027-.358.812-.644-.479-.94-.288.095-.082-.537.5-.8-.028-1.453.26-.694-.503-.198-.118.576-.94.069-.205-.851-.265.06-.154-.315.121-.318-.62-.635-.384-.098-.155-.749-.68.331-.412-1.123-.457-.312-.53.092-.752-.631.123-.13-.176-.77-.983-1.08.224-.148L1 41.921l.325-.46.838-.436.164.353.173-.167 1.057.255.394-.447.057-.404 1.247.792z",
    fill: "#FC0",
    stroke: "#fff",
    strokeWidth: ".5"
  }));
};

RomaniaCountyMap.defaultProps = {
  width: "122",
  height: "88",
  viewBox: "0 0 122 88",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var ShowcaseItem = (_ref) => {
  var classes = _ref.classes,
      icon = _ref.icon,
      value = _ref.value,
      children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: classes.showcaseItem
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.showcaseIcon
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: classes.showcaseValue
  }, formatGroupedNumber(value)), /*#__PURE__*/React.createElement(DivBodyLarge, {
    className: classes.showcaseText
  }, children));
};

var ElectionObservationSection = themable("ElectionObservationSection", cssClasses$d)((_ref2) => {
  var observation = _ref2.observation,
      classes = _ref2.classes;
  var theme = useTheme();
  var items = [{
    color: theme.colors.primary,
    legendName: "Mesaje trimise de către observatori",
    value: observation.messageCount,
    valueLabel: formatGroupedNumber(observation.messageCount)
  }, {
    color: theme.colors.secondary,
    legendName: "Probleme sesizate",
    value: observation.issueCount,
    valueLabel: formatGroupedNumber(observation.issueCount)
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement(Heading2, null, "Observarea independent\u0103 a alegerilor"), /*#__PURE__*/React.createElement(DivBodyLarge, null, "Aceste date sunt colectate prin aplica\u021Bia", " ", /*#__PURE__*/React.createElement("a", {
    href: "https://monitorizarevot.ro",
    target: "_blank",
    rel: "noreferrer"
  }, "Monitorizare Vot"), ", dezvoltat\u0103 de", " ", /*#__PURE__*/React.createElement("a", {
    href: "https://code4.ro",
    target: "_blank",
    rel: "noreferrer"
  }, "Code for Romania"), ", de la observatorii independen\u021Bi acredita\u021Bi \xEEn sec\u021Biile de votare acoperite."), /*#__PURE__*/React.createElement("div", {
    className: classes.showcase
  }, /*#__PURE__*/React.createElement(ShowcaseItem, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(BallotDrop, null),
    value: observation.coveredPollingPlaces
  }, "Sec\u021Bii de votare acoperite"), /*#__PURE__*/React.createElement(ShowcaseItem, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(RomaniaCountyMap, null),
    value: observation.coveredCounties
  }, "Jude\u021Be acoperite"), /*#__PURE__*/React.createElement(ShowcaseItem, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(RaisedHands, null),
    value: observation.observerCount
  }, "Observatori loga\u021Bi \xEEn aplica\u021Bie")), /*#__PURE__*/React.createElement(PercentageBars, {
    items: items
  }), /*#__PURE__*/React.createElement(PercentageBarsLegend, {
    items: items
  }));
});

var css_248z$e = ".ElectionResultsSummarySection-module_warning__gnumQ{margin-top:.5rem;margin-bottom:2rem}.ElectionResultsSummarySection-module_stackedBar__1SYl4{margin-top:1rem}.ElectionResultsSummarySection-module_map__2XCTQ{flex:1;margin-bottom:2rem}.ElectionResultsSummarySection-module_mapSummaryContainer__1wyFC{margin-top:2rem;display:flex;flex-direction:row;width:100%;align-items:stretch}.ElectionResultsSummarySection-module_mapSummaryTable__2Uaka{margin-right:1rem;width:20rem;max-height:24rem;align-self:flex-start}";
var cssClasses$e = {
  "warning": "ElectionResultsSummarySection-module_warning__gnumQ",
  "stackedBar": "ElectionResultsSummarySection-module_stackedBar__1SYl4",
  "map": "ElectionResultsSummarySection-module_map__2XCTQ",
  "mapSummaryContainer": "ElectionResultsSummarySection-module_mapSummaryContainer__1wyFC",
  "mapSummaryTable": "ElectionResultsSummarySection-module_mapSummaryTable__2Uaka"
};
styleInject(css_248z$e);

var css_248z$f = ".ElectionResultsStackedBar-module_root__ljRFk{display:flex;flex-direction:column;align-items:stretch}.ElectionResultsStackedBar-module_cards__2Zt_w,.ElectionResultsStackedBar-module_legend__Na9WJ{display:flex;flex-direction:row;justify-content:space-between}.ElectionResultsStackedBar-module_legend__Na9WJ{flex-wrap:wrap;margin-right:-.5em}.ElectionResultsStackedBar-module_legendItem__qQkYO{margin-right:.5em;margin-bottom:.5em}";
var cssClasses$f = {
  "root": "ElectionResultsStackedBar-module_root__ljRFk",
  "cards": "ElectionResultsStackedBar-module_cards__2Zt_w",
  "legend": "ElectionResultsStackedBar-module_legend__Na9WJ",
  "legendItem": "ElectionResultsStackedBar-module_legendItem__qQkYO"
};
styleInject(css_248z$f);

var defaultConstants$2 = {
  neutralColor: "#B5B5B5",
  maxStackedBarItems: 4,
  breakpoint1: 850,
  breakpoint2: 700,
  breakpoint3: 330
};
var ElectionResultsStackedBar = themable("ElectionResultsStackedBar", cssClasses$f, defaultConstants$2)((_ref) => {
  var classes = _ref.classes,
      results = _ref.results,
      constants = _ref.constants;
  var candidates = results.candidates;
  var neutralColor = constants.neutralColor,
      maxStackedBarItems = constants.maxStackedBarItems,
      breakpoint1 = constants.breakpoint1,
      breakpoint2 = constants.breakpoint2,
      breakpoint3 = constants.breakpoint3;

  var _useMemo = useMemo(() => {
    var items = [];
    var stackedBarCount = candidates.length === maxStackedBarItems + 1 ? maxStackedBarItems + 1 : maxStackedBarItems;

    for (var i = 0; i < stackedBarCount; i++) {
      var candidate = candidates[i];

      if (candidate) {
        var _candidate$shortName;

        var color = electionCandidateColor(candidate);
        var percent = fractionOf(candidate.votes, results.validVotes);
        items.push({
          name: (_candidate$shortName = candidate.shortName) !== null && _candidate$shortName !== void 0 ? _candidate$shortName : candidate.name,
          color,
          value: candidate.votes,
          percent,
          logo: candidate.partyLogo,
          index: items.length
        });
      }
    }

    if (candidates.length > stackedBarCount) {
      var total = 0;

      for (var _i = stackedBarCount; _i < candidates.length; _i++) {
        total += candidates[_i].votes;
      }

      items.push({
        value: total,
        color: constants.neutralColor,
        name: "Alții",
        percent: fractionOf(total, results.validVotes),
        index: items.length
      });
    }

    var stackItems = new Array(items.length);

    for (var _i2 = 0; _i2 < items.length; _i2++) {
      stackItems[_i2 % 2 ? items.length - 1 - (_i2 >> 1) : _i2 >> 1] = items[_i2];
    }

    return [stackItems, items];
  }, [candidates, neutralColor, maxStackedBarItems, breakpoint1, breakpoint2, breakpoint3]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      stackedBarItems = _useMemo2[0],
      legendItems = _useMemo2[1];

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      measureRef = _useDimensions2[0],
      _useDimensions2$1$wid = _useDimensions2[1].width,
      width = _useDimensions2$1$wid === void 0 ? Infinity : _useDimensions2$1$wid;

  if (candidates.length === 0) {
    return null;
  }

  return /*#__PURE__*/React.createElement("div", {
    className: classes.root,
    ref: measureRef
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.cards
  }, stackedBarItems.map((item, index) => (width >= breakpoint2 || item.index < 2) && /*#__PURE__*/React.createElement(PartyResultCard, {
    key: item.index,
    name: item.name,
    color: item.color,
    percentage: item.percent,
    iconUrl: (width >= breakpoint1 || item.index < 2) && width >= breakpoint3 ? item.logo : undefined,
    rightAligned: index === stackedBarItems.length - 1
  }))), /*#__PURE__*/React.createElement(HorizontalStackedBar, {
    items: stackedBarItems
  }), /*#__PURE__*/React.createElement("div", {
    className: classes.legend
  }, legendItems.map(item => /*#__PURE__*/React.createElement(PartyResultInline, {
    key: item.index,
    className: classes.legendItem,
    name: item.name,
    color: item.color,
    votes: item.value,
    percentage: item.percent
  }))));
});

var css_248z$g = ".ElectionResultsSummaryTable-module_root__wudrG{border:1px solid #ccc;display:flex;flex-direction:column;align-items:stretch}.ElectionResultsSummaryTable-module_name__3FcyC{max-width:5rem;text-overflow:ellipsis;overflow:hidden}.ElectionResultsSummaryTable-module_header__2lP96{padding:.5rem .75rem}.ElectionResultsSummaryTable-module_square__3_UEL{vertical-align:baseline;width:.8125rem;height:.8125rem;margin-right:.25rem}.ElectionResultsSummaryTable-module_tableContainer__bVT-T{flex:1;overflow-y:auto;scrollbar-width:thin}.ElectionResultsSummaryTable-module_table__2kuln{width:100%}.ElectionResultsSummaryTable-module_table__2kuln td,.ElectionResultsSummaryTable-module_table__2kuln th{padding:.25rem;white-space:nowrap}.ElectionResultsSummaryTable-module_table__2kuln td:first-child,.ElectionResultsSummaryTable-module_table__2kuln th:first-child{padding-left:.75rem}.ElectionResultsSummaryTable-module_table__2kuln td{font-size:.9375rem}.ElectionResultsSummaryTable-module_table__2kuln thead tr{text-align:left}.ElectionResultsSummaryTable-module_table__2kuln tbody tr:not(:last-child),.ElectionResultsSummaryTable-module_table__2kuln thead tr{border-bottom:1px dashed #ccc}.ElectionResultsSummaryTable-module_barContainer__CHsRA{min-width:1.5rem;vertical-align:middle}.ElectionResultsSummaryTable-module_bar__EwuSG{height:.8125rem}.ElectionResultsSummaryTable-module_percentage__1n1pq{text-align:right}";
var cssClasses$g = {
  "root": "ElectionResultsSummaryTable-module_root__wudrG",
  "name": "ElectionResultsSummaryTable-module_name__3FcyC",
  "header": "ElectionResultsSummaryTable-module_header__2lP96",
  "square": "ElectionResultsSummaryTable-module_square__3_UEL",
  "tableContainer": "ElectionResultsSummaryTable-module_tableContainer__bVT-T",
  "table": "ElectionResultsSummaryTable-module_table__2kuln",
  "barContainer": "ElectionResultsSummaryTable-module_barContainer__CHsRA",
  "bar": "ElectionResultsSummaryTable-module_bar__EwuSG",
  "percentage": "ElectionResultsSummaryTable-module_percentage__1n1pq"
};
styleInject(css_248z$g);

var THeadRow = makeTypographyComponent("th", "label");
var TCell = makeTypographyComponent("td", "bodyMedium");
var ElectionResultsSummaryTable = themable("ElectionResultsSummaryTable", cssClasses$g)((_ref) => {
  var classes = _ref.classes,
      results = _ref.results,
      meta = _ref.meta;
  var hasSeats = electionHasSeats(meta.type, results);
  var maxFraction = results.candidates.reduce((acc, cand) => Math.max(acc, fractionOf(cand.votes, results.validVotes)), 0);
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.header
  }, meta.ballot && /*#__PURE__*/React.createElement(DivBody, null, meta.title), /*#__PURE__*/React.createElement(Heading3, null, meta.ballot || meta.title, " ", lightFormat(parseISO(meta.date), "yyyy"))), /*#__PURE__*/React.createElement("div", {
    className: classes.tableContainer
  }, /*#__PURE__*/React.createElement("table", {
    className: classes.table
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement(THeadRow, null, "Partid"), hasSeats && /*#__PURE__*/React.createElement(THeadRow, null, "Mand."), /*#__PURE__*/React.createElement(THeadRow, null, "Voturi"), /*#__PURE__*/React.createElement(THeadRow, {
    className: classes.percentage
  }, "%"), /*#__PURE__*/React.createElement(THeadRow, null))), /*#__PURE__*/React.createElement("tbody", null, results.candidates.map((candidate, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement(TCell, {
    className: classes.name
  }, /*#__PURE__*/React.createElement(ColoredSquare, {
    color: electionCandidateColor(candidate),
    className: classes.square
  }), candidate.shortName || candidate.name), hasSeats && /*#__PURE__*/React.createElement(TCell, null, candidate.seats != null && formatGroupedNumber(candidate.seats)), /*#__PURE__*/React.createElement(TCell, null, formatGroupedNumber(candidate.votes)), /*#__PURE__*/React.createElement(TCell, {
    className: classes.percentage
  }, formatPercentage(fractionOf(candidate.votes, results.validVotes))), /*#__PURE__*/React.createElement("td", {
    className: classes.barContainer
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.bar,
    style: {
      width: "".concat(100 * fractionOf(fractionOf(candidate.votes, results.validVotes), maxFraction), "%"),
      backgroundColor: electionCandidateColor(candidate)
    }
  }))))))));
});

var defaultConstants$3 = {
  breakpoint1: 840,
  breakpoint2: 330
};
var ElectionResultsSummarySection = themable("ElectionResultsSummarySection", cssClasses$e, defaultConstants$3)((_ref) => {
  var classes = _ref.classes,
      results = _ref.results,
      meta = _ref.meta,
      scope = _ref.scope,
      constants = _ref.constants,
      separator = _ref.separator;
  var involvesDiaspora = electionTypeInvolvesDiaspora(meta.type);

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      measureRef = _useDimensions2[0],
      width = _useDimensions2[1].width;

  var completeness = electionScopeIsComplete(scope);
  var map = width != null && /*#__PURE__*/React.createElement(ElectionMap, {
    scope: scope,
    involvesDiaspora: involvesDiaspora,
    className: classes.map
  });
  var breakpoint1 = constants.breakpoint1,
      breakpoint2 = constants.breakpoint2;
  var mobileMap = width != null && width <= breakpoint2;
  var fullWidthMap = !mobileMap && width != null && width <= breakpoint1;
  var showHeading = results != null && completeness.complete;
  return /*#__PURE__*/React.createElement(React.Fragment, null, mobileMap && map, mobileMap && showHeading && separator, showHeading && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading2, null, "Prezen\u021Ba la vot"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Label, null, getScopeName(scope)))), !completeness.complete && /*#__PURE__*/React.createElement(ElectionScopeIncompleteWarning, {
    className: classes.warning,
    completeness: completeness,
    page: "results"
  }), results == null && completeness.complete && /*#__PURE__*/React.createElement(DivBodyHuge, {
    className: classes.warning
  }, "Nu exist\u0103 date despre prezen\u021Ba la vot pentru acest nivel de detaliu."), results && /*#__PURE__*/React.createElement(ElectionResultsStackedBar, {
    className: classes.stackedBar,
    results: results
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    },
    ref: measureRef
  }), results && !mobileMap && separator, !mobileMap && /*#__PURE__*/React.createElement("div", {
    className: classes.mapSummaryContainer
  }, !fullWidthMap && results && /*#__PURE__*/React.createElement(ElectionResultsSummaryTable, {
    className: classes.mapSummaryTable,
    meta: meta,
    results: results
  }), map));
});

var css_248z$h = ".ElectionResultsSeats-module_root__1tK0L{display:flex;flex-direction:row;align-items:flex-start}.ElectionResultsSeats-module_legend__2_oqk{display:flex;flex-direction:row;flex-wrap:wrap;margin-right:-1rem;justify-content:flex-start;max-width:15rem}.ElectionResultsSeats-module_legendItem__RJdXl{display:flex;flex-direction:row;flex-wrap:nowrap;align-items:center;margin-right:1rem;margin-bottom:.5rem;max-width:8rem}.ElectionResultsSeats-module_square__1afPF{display:block;margin-right:.5rem;flex-shrink:0}.ElectionResultsSeats-module_legendLabel__3y5W0{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.ElectionResultsSeats-module_legendLabelSelected__jqQMd{font-weight:600}.ElectionResultsSeats-module_legendValue__32NLG{flex-shrink:0}.ElectionResultsSeats-module_svgContainer__3iYWO{flex:1;display:flex;flex-direction:column;align-items:center}.ElectionResultsSeats-module_seatCount__1mTGU{fill:#5e5e5e;font-weight:600;text-anchor:middle;font-size:14px}.ElectionResultsSeats-module_vertical__142hk{flex-direction:column-reverse;align-items:stretch}.ElectionResultsSeats-module_vertical__142hk .ElectionResultsSeats-module_svgContainer__3iYWO{margin-bottom:.5rem}.ElectionResultsSeats-module_vertical__142hk .ElectionResultsSeats-module_legend__2_oqk{justify-content:center;max-width:none}";
var cssClasses$h = {
  "root": "ElectionResultsSeats-module_root__1tK0L",
  "legend": "ElectionResultsSeats-module_legend__2_oqk",
  "legendItem": "ElectionResultsSeats-module_legendItem__RJdXl",
  "square": "ElectionResultsSeats-module_square__1afPF",
  "legendLabel": "ElectionResultsSeats-module_legendLabel__3y5W0",
  "legendLabelSelected": "ElectionResultsSeats-module_legendLabelSelected__jqQMd",
  "legendValue": "ElectionResultsSeats-module_legendValue__32NLG",
  "svgContainer": "ElectionResultsSeats-module_svgContainer__3iYWO",
  "seatCount": "ElectionResultsSeats-module_seatCount__1mTGU",
  "vertical": "ElectionResultsSeats-module_vertical__142hk"
};
styleInject(css_248z$h);

var DecorativeIcon = () => /*#__PURE__*/React.createElement("path", {
  // eslint-disable-next-line max-len
  d: "M3.72141 35.6231C3.67453 35.8779 3.64811 36.1362 3.63959 36.3945V41.6996C3.6464 43.886 5.00424 45.8405 7.05249 46.6085V54.4145C7.06187 57.0279 9.11694 59.1759 11.7269 59.2995V104.396C9.11694 104.52 7.06187 106.668 7.05249 109.281V117.064C4.99997 117.852 3.64299 119.821 3.63959 122.019V127.208C3.63959 128.176 4.42547 128.961 5.39292 128.961H123.61C124.578 128.961 125.363 128.176 125.363 127.208V122.019C125.359 119.821 124.003 117.852 121.951 117.064V109.235C121.941 106.622 119.886 104.474 117.276 104.35V59.2995C119.886 59.1759 121.941 57.0279 121.951 54.4145V46.6085C123.998 45.8405 125.356 43.886 125.363 41.6996V36.4294C125.355 36.1711 125.328 35.9129 125.281 35.658C126.162 36.0484 127.193 35.6512 127.583 34.7698C127.974 33.8893 127.577 32.8588 126.696 32.4676L65.308 0.202652C64.7957 -0.0675507 64.1837 -0.0675507 63.6715 0.202652L2.28431 32.4326C1.42767 32.8852 1.09951 33.9447 1.55042 34.8014C1.96296 35.5839 2.89376 35.9367 3.72141 35.6231ZM10.5583 49.6463V46.9469H30.7749V49.6233L10.5583 49.6463ZM55.5731 59.3114V104.396C52.9631 104.52 50.908 106.668 50.8986 109.281V116.737H34.2569V109.281C34.2475 106.668 32.1924 104.52 29.5825 104.396V59.2995C32.1924 59.1759 34.2475 57.0279 34.2569 54.4145V46.9469H50.8748V54.4034C50.879 57.0211 52.9358 59.1742 55.55 59.2995L55.5731 59.3114ZM54.4044 49.6463V46.9469H74.6219V49.6233L54.4044 49.6463ZM99.42 59.3114V104.396C96.8101 104.52 94.7541 106.668 94.7448 109.281V116.737H78.1039V109.281C78.0945 106.668 76.0386 104.52 73.4294 104.396V59.2995C76.0386 59.1759 78.0945 57.0279 78.1039 54.4145V46.9469H94.7218V54.4034C94.7252 57.0211 96.7819 59.1742 99.3962 59.2995L99.42 59.3114ZM98.2514 49.6463V46.9469H118.468V49.6233L98.2514 49.6463ZM118.468 114.061V116.737H98.2276V114.061H118.468ZM74.6219 114.061V116.737H54.3814V114.061H74.6219ZM57.3025 55.8286H55.7836C55.0088 55.8286 54.3814 55.2013 54.3814 54.4264V53.1521H74.598V54.4264C74.598 55.2013 73.9707 55.8286 73.1959 55.8286H57.3025ZM69.9356 59.3344V104.373H59.0559V59.3344H69.9356ZM57.3025 107.879H73.1959C73.9707 107.879 74.598 108.506 74.598 109.281V110.555H54.3814V109.281C54.3814 108.506 55.0088 107.879 55.7836 107.879H57.3025ZM30.7519 114.061V116.737H10.5344V114.061H30.7519ZM10.5344 54.4614V53.1521H30.7519V54.4264C30.7519 55.2013 30.1246 55.8286 29.3489 55.8286H11.9017C11.1362 55.8098 10.5276 55.1799 10.5344 54.4145V54.4614ZM26.0775 59.3694V104.373H15.2089V59.3344L26.0775 59.3694ZM10.5344 109.317C10.5344 108.541 11.1618 107.914 11.9366 107.914H29.3489C30.1246 107.914 30.7519 108.541 30.7519 109.317V110.59H10.5344V109.317ZM121.857 122.09V125.525H7.12239V122.09C7.12239 121.089 7.933 120.277 8.93368 120.277H120.046C121.032 120.277 121.838 121.068 121.857 122.054V122.09ZM118.445 109.317V110.59H98.2276V109.317C98.2276 108.541 98.8549 107.914 99.6297 107.914H117.078C117.825 107.933 118.426 108.533 118.445 109.281V109.317ZM102.902 104.408V59.3344H113.782V104.373L102.902 104.408ZM118.445 54.4614C118.445 55.2362 117.818 55.8635 117.043 55.8635H99.6417C98.8669 55.8635 98.2395 55.2362 98.2395 54.4614V53.1521H118.456L118.445 54.4614ZM64.4897 3.70847L116.692 31.1473H12.2878L64.4897 3.70847ZM7.12239 36.4294C7.12239 35.462 7.90742 34.6769 8.87487 34.6769H120.105C121.072 34.6769 121.857 35.462 121.857 36.4294V41.7354C121.857 42.7029 121.072 43.4879 120.105 43.4879H8.87487C7.90742 43.4879 7.12239 42.7029 7.12239 41.7354V36.4294Z",
  fill: "#EEEEEE",
  fillOpacity: 0.43
});

var SeatsGraphic = /*#__PURE__*/memo(function SeatsGraphicUnmemoized(_ref) {
  var classes = _ref.classes,
      results = _ref.results,
      width = _ref.width,
      height = _ref.height,
      selectedCandidate = _ref.selectedCandidate,
      onSelectCandidate = _ref.onSelectCandidate;
  var totalSeats = results.totalSeats || 1; // Scale the dot size with the total number of dots so that
  // the total area of the graph remains the same.

  var r = useMemo(() => 45.345892868 / Math.sqrt(totalSeats), [totalSeats]);

  var _useMemo = useMemo(() => {
    var _rows;

    var spacing = 2.3;
    var dotsArray = []; // Determine how many dots fit in each row

    var R = 100 - r;
    var seatsLeft = totalSeats;
    var rows = [];

    while (seatsLeft > 0) {
      // Offset the first and last dot by a tiny angle so that they're tangent to the bottom of the viewport
      var offset = Math.asin(r / R);
      var seatsOnRow = 1 + Math.max(0, Math.floor((Math.PI - offset * 2) * R / (r * spacing)));
      seatsLeft -= seatsOnRow;
      rows.push({
        R,
        offset,
        seatsOnRow
      });
      R -= r * spacing;
    } // We might have some empty slots left over that we need to
    // remove evenly from amongst the rows.


    if (seatsLeft < 0) {
      var div = Math.floor(-seatsLeft / rows.length);

      for (var i = 0; i < rows.length; i += 1) {
        rows[i].seatsOnRow -= div;
      }

      seatsLeft += div * rows.length;
    } // If they don't split evenly, remove the rest starting with the innermost row.


    if (seatsLeft < 0) {
      for (var _i = rows.length - 1; _i >= 0 && seatsLeft < 0; _i -= 1) {
        rows[_i].seatsOnRow -= 1;
        seatsLeft += 1;
      }
    } // Position each dot in polar coordinates


    for (var _i2 = 0; _i2 < rows.length; _i2++) {
      var _rows$_i = rows[_i2],
          _seatsOnRow = _rows$_i.seatsOnRow,
          _offset = _rows$_i.offset,
          rowR = _rows$_i.R;
      var stride = (Math.PI - _offset * 2) / (_seatsOnRow - 1);

      for (var j = 0; j < _seatsOnRow; j++) {
        dotsArray.push({
          alpha: _offset + j * stride,
          R: rowR,
          candidate: null
        });
      }
    } // Sort the dots radially left to right


    dotsArray.sort((a, b) => a.alpha - b.alpha); // Assign candidates to each dot

    var start = 0;
    var end = dotsArray.length - 1;
    var fromStart = false; // Alternate each candidate left/right

    results.candidates.forEach((candidate, index) => {
      var seats = candidate.seats;

      if (Number.isFinite(seats) && seats != null && seats > 0) {
        fromStart = !fromStart;

        for (; seats > 0 && start <= end; seats -= 1) {
          dotsArray[fromStart ? start : end].candidate = index;

          if (fromStart) {
            start += 1;
          } else {
            end -= 1;
          }
        }
      }
    });
    return [dotsArray, ((_rows = rows[rows.length - 1]) === null || _rows === void 0 ? void 0 : _rows.R) - r];
  }, [totalSeats, results]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      dots = _useMemo2[0],
      innerRadius = _useMemo2[1];

  var onDeselect = useCallback(() => {
    onSelectCandidate(null);
  }, [onSelectCandidate]);
  return /*#__PURE__*/React.createElement("svg", {
    className: classes.svg,
    viewBox: "-2 -1 204 102",
    width: width,
    height: height,
    onMouseLeave: onDeselect
  }, /*#__PURE__*/React.createElement("path", {
    d: "\n          M -5 100\n          A 105 105 0 0 1 205 100\n          L ".concat(100 + innerRadius - 5, " 100\n          A ").concat(innerRadius - 5, " ").concat(innerRadius - 5, " 0 0 0 ").concat(100 - innerRadius + 5, " 100\n          L -5 100\n        "),
    fill: "transparent",
    stroke: "transparent",
    onMouseLeave: onDeselect
  }), dots.map((dot, index) => /*#__PURE__*/React.createElement("circle", {
    key: index,
    r: r,
    cx: 100 - dot.R * Math.cos(dot.alpha),
    cy: 100 - dot.R * Math.sin(dot.alpha),
    fill: dot.candidate != null ? electionCandidateColor(results.candidates[dot.candidate]) : "#ccc",
    strokeWidth: selectedCandidate !== null && selectedCandidate === dot.candidate ? 1 : 0,
    stroke: "#000",
    onMouseOver: () => {
      onSelectCandidate(dot.candidate);
    }
  })), /*#__PURE__*/React.createElement("g", {
    transform: "translate(100 78.75) scale(0.33 0.33) translate(-64.5 -64.5)"
  }, /*#__PURE__*/React.createElement(DecorativeIcon, null)), /*#__PURE__*/React.createElement("text", {
    x: 100,
    y: 85,
    dominantBaseline: "middle",
    className: classes.seatCount
  }, formatGroupedNumber(totalSeats)));
});
var defaultConstants$4 = {
  breakpoint: 560,
  height: 200
};
var ElectionResultsSeats = themable("ElectionResultsSeats", cssClasses$h, defaultConstants$4)((_ref2) => {
  var classes = _ref2.classes,
      constants = _ref2.constants,
      results = _ref2.results;

  var _useDimensions = useDimensions(),
      _useDimensions2 = _slicedToArray(_useDimensions, 2),
      measureRef = _useDimensions2[0],
      _useDimensions2$1$wid = _useDimensions2[1].width,
      width = _useDimensions2$1$wid === void 0 ? NaN : _useDimensions2$1$wid;

  var svgHeight = constants.height;
  var svgWidth = constants.height * 2;

  if (svgWidth > width) {
    svgWidth = width;
    svgHeight = svgWidth * 0.5;
  }

  var vertical = width < constants.breakpoint;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      selectedCandidate = _useState2[0],
      setSelectedCandidate = _useState2[1];

  return /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.root, vertical && classes.vertical),
    ref: measureRef
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.legend
  }, results.candidates.map((candidate, index) => {
    var _candidate$shortName;

    return Number.isFinite(candidate.seats) && candidate.seats != null && candidate.seats > 0 ? /*#__PURE__*/React.createElement(DivBody, {
      className: classes.legendItem,
      key: index
    }, /*#__PURE__*/React.createElement(ColoredSquare, {
      className: classes.square,
      color: electionCandidateColor(candidate)
    }), /*#__PURE__*/React.createElement("div", {
      className: mergeClasses(classes.legendLabel, index === selectedCandidate && classes.legendLabelSelected)
    }, (_candidate$shortName = candidate.shortName) !== null && _candidate$shortName !== void 0 ? _candidate$shortName : candidate.name), /*#__PURE__*/React.createElement(DivLabel, {
      className: classes.legendValue
    }, "\xA0(", formatGroupedNumber(candidate.seats), ")")) : null;
  })), /*#__PURE__*/React.createElement("div", {
    className: classes.svgContainer
  }, /*#__PURE__*/React.createElement(SeatsGraphic, {
    classes: classes,
    results: results,
    width: svgWidth,
    height: svgHeight,
    selectedCandidate: selectedCandidate,
    onSelectCandidate: setSelectedCandidate
  })));
});

var css_248z$i = ".ElectionResultsTableSection-module_tableContainer__2V8xK{margin-bottom:1rem;display:flex;flex-direction:column;align-items:stretch}.ElectionResultsTableSection-module_table__PZVoA .ElectionResultsTableSection-module_nameCell__tPWlD{text-align:left;padding-left:.5rem}.ElectionResultsTableSection-module_heading__2h46m{margin-bottom:.5rem}.ElectionResultsTableSection-module_collapseButton__c55LZ{margin-top:.5rem;align-self:flex-end}";
var cssClasses$i = {
  "tableContainer": "ElectionResultsTableSection-module_tableContainer__2V8xK",
  "table": "ElectionResultsTableSection-module_table__PZVoA",
  "nameCell": "ElectionResultsTableSection-module_nameCell__tPWlD",
  "heading": "ElectionResultsTableSection-module_heading__2h46m",
  "collapseButton": "ElectionResultsTableSection-module_collapseButton__c55LZ"
};
styleInject(css_248z$i);

var CandidateTable = (_ref) => {
  var classes = _ref.classes,
      validVotes = _ref.validVotes,
      candidates = _ref.candidates,
      hasSeats = _ref.hasSeats;
  var hasSeatsGained = hasSeats && candidates.reduce((acc, candidate) => acc || candidate.seatsGained != null, false);
  var hasCandidateCount = candidates.reduce((acc, candidate) => acc || candidate.candidateCount != null, false);

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      collapsed = _useState2[0],
      setCollapsed = _useState2[1];

  var canCollapse = candidates.length >= 8;
  var onToggleCollapsed = useCallback(() => {
    setCollapsed(x => !x);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: classes.tableContainer
  }, /*#__PURE__*/React.createElement(ResultsTable, {
    className: classes.table
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Partid / Alian\u021B\u0103 / Candidat independent"), hasCandidateCount && /*#__PURE__*/React.createElement("th", null, "Nr. cand."), /*#__PURE__*/React.createElement("th", null, "Voturi"), /*#__PURE__*/React.createElement("th", null, "%"), hasSeats && /*#__PURE__*/React.createElement("th", null, "Mandate"), hasSeatsGained && /*#__PURE__*/React.createElement("th", null, "+/-"))), /*#__PURE__*/React.createElement("tbody", null, candidates.map((candidate, index) => (!(canCollapse && collapsed) || index < 5) && /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    className: classes.nameCell
  }, candidate.name), hasCandidateCount && /*#__PURE__*/React.createElement("th", null, formatGroupedNumber(candidate.candidateCount || 0)), /*#__PURE__*/React.createElement("td", null, formatGroupedNumber(candidate.votes)), /*#__PURE__*/React.createElement("td", null, formatPercentage(fractionOf(candidate.votes, validVotes))), hasSeats && /*#__PURE__*/React.createElement("td", null, formatGroupedNumber(candidate.seats || 0)), hasSeatsGained && /*#__PURE__*/React.createElement("td", null, typeof candidate.seatsGained === "number" ? formatGroupedNumber(candidate.seatsGained) : candidate.seatsGained === "new" ? "Nou" : candidate.seatsGained))))), canCollapse && /*#__PURE__*/React.createElement(Button, {
    className: classes.collapseButton,
    onClick: onToggleCollapsed
  }, collapsed ? "Afișează toți candidații" : "Ascunde toți candidații"));
};

var ElectionResultsTableSection = themable("ElectionResultsTableSection", cssClasses$i)((_ref2) => {
  var classes = _ref2.classes,
      results = _ref2.results,
      meta = _ref2.meta;
  var hasSeats = electionHasSeats(meta.type, results);
  var qualified = hasSeats ? results.candidates.filter(cand => Number.isFinite(cand.seats) && (cand.seats || 0) > 0) : results.candidates;
  var unqualified = hasSeats ? results.candidates.filter(cand => !Number.isFinite(cand.seats) || (cand.seats || 0) <= 0) : null;

  if (unqualified && unqualified.length > 0) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading2, {
      className: classes.heading
    }, "Partide care au \xEEndeplinit pragul electoral"), /*#__PURE__*/React.createElement(CandidateTable, {
      classes: classes,
      candidates: qualified,
      hasSeats: hasSeats,
      validVotes: results.validVotes
    }), /*#__PURE__*/React.createElement(Heading2, {
      className: classes.heading
    }, "Partide care nu au \xEEndeplinit pragul electoral"), /*#__PURE__*/React.createElement(CandidateTable, {
      classes: classes,
      candidates: unqualified,
      hasSeats: false,
      validVotes: results.validVotes
    }));
  }

  return /*#__PURE__*/React.createElement(CandidateTable, {
    classes: classes,
    candidates: qualified,
    hasSeats: hasSeats,
    validVotes: results.validVotes
  });
});

var css_248z$j = ".ElectionResultsProcess-module_root__hPyje{display:flex;flex-direction:row;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;margin-right:-1rem}.ElectionResultsProcess-module_showcaseItem__3NZL0{width:28rem;margin:1rem 1rem 1rem 0;display:flex;flex-direction:row;align-items:center}.ElectionResultsProcess-module_showcaseIcon__29ffC{height:5rem;width:5rem;margin-right:1.5rem;display:flex;flex-direction:row;align-items:center}.ElectionResultsProcess-module_showcaseIcon__29ffC svg{width:100%;height:100%}.ElectionResultsProcess-module_showcaseContainer__1lzg_{display:flex;flex-direction:column;flex:1}.ElectionResultsProcess-module_showcaseValue__YC1Ng{font-size:2.25rem;font-weight:600;line-height:1;color:#ecbe07}";
var cssClasses$j = {
  "root": "ElectionResultsProcess-module_root__hPyje",
  "showcaseItem": "ElectionResultsProcess-module_showcaseItem__3NZL0",
  "showcaseIcon": "ElectionResultsProcess-module_showcaseIcon__29ffC",
  "showcaseContainer": "ElectionResultsProcess-module_showcaseContainer__1lzg_",
  "showcaseValue": "ElectionResultsProcess-module_showcaseValue__YC1Ng"
};
styleInject(css_248z$j);

var BallotFillIn = function BallotFillIn(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M5.355 34.806h16.064V50.87H5.355V34.806zM5.355 57.565h16.064v16.064H5.355V57.564zM40.161 26.774H5.355V13.387H40.16v13.387z",
    fill: "#F0BC5E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M58.987 42.839a4 4 0 0 1 2.228.674l9.35 6.234a6.686 6.686 0 0 0 3.713 1.124H83v-2.677h-8.72a4.007 4.007 0 0 1-2.23-.675l-3.776-2.518V0h-50.87v8.032H0V83h50.871v-8.032h17.403V63.705c.085-.02.171-.027.256-.047l6.227-1.556a17.424 17.424 0 0 1 4.227-.521H83v-2.678h-4.016c-1.641 0-3.283.202-4.876.6l-6.227 1.557c-3.201.8-6.608.669-9.735-.374l-2.256-.752a20.072 20.072 0 0 0-6.358-1.03H37.851a4.021 4.021 0 0 1 4.016-4.017h14.726a4.021 4.021 0 0 0 4.016-4.016c0-2.054-1.556-3.733-3.547-3.97l1.1-4.062h.825zm-1.69 20.387a20.04 20.04 0 0 0 6.357 1.032c.65 0 1.298-.056 1.943-.119v8.151H50.87v-4.379a4.829 4.829 0 0 0 1.03-1.908l1.096-4.06c.69.14 1.373.307 2.044.532l2.256.75zm-6.983-1.615l-.998 3.692a2.211 2.211 0 0 1-2.13 1.633h-.434a2.208 2.208 0 0 1-2.13-2.783l.695-2.572h4.215c.261 0 .521.02.782.03zm-7.771-.03l-.506 1.872a4.872 4.872 0 0 0-.169 1.276c0 1.81 1.001 3.375 2.468 4.219l-.42 1.678 2.596.65.417-1.663h.257c.345 0 .68-.049 1.008-.118v10.828H2.677V10.71h17.404V2.677h45.516v40.54L62.7 41.286a6.683 6.683 0 0 0-3.714-1.125h-.103l5.572-20.614a4.89 4.89 0 0 0-4.715-6.16h-.434a4.893 4.893 0 0 0-4.715 3.61l-3.721 13.77V8.032H22.758v2.678h25.436V40.16h-2.77a6.62 6.62 0 0 0-3.976 1.339H28.113v2.677h10.522l-2.677 2.678h-7.845v2.677h5.168l-2.236 2.237a4.15 4.15 0 0 0-1.225 2.956A4.183 4.183 0 0 0 34 58.903c.412 0 .81-.079 1.195-.194-.002.066-.02.128-.02.194a2.68 2.68 0 0 0 2.677 2.678h4.69zm10.312-9.371H47.85l5.653-20.916 4.592 1.53-5.24 19.386zm-10.27-8.196a4.048 4.048 0 0 1 2.839-1.175h2.184l-1.092 4.04a6.633 6.633 0 0 0-4.486 1.936l-6.97 6.97a1.503 1.503 0 0 1-2.564-1.06c0-.401.157-.778.44-1.062l9.648-9.649zm1.338 6.694a4.034 4.034 0 0 1 1.837-1.031l-.684 2.533h-2.654l1.501-1.502zm17.948-31.86l-1.64 6.065-4.592-1.53 1.537-5.686a2.213 2.213 0 0 1 2.131-1.633h.434a2.208 2.208 0 0 1 2.13 2.784zm-6.93 7.124l4.592 1.53-.74 2.733-4.592-1.53.74-2.733zm1.651 23.56a1.34 1.34 0 0 1 1.34 1.339c0 .737-.602 1.339-1.34 1.339h-.964l.724-2.678h.24z",
    fill: "#9AABB4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.71 18.742h2.677v2.678H10.71v-2.678zM16.064 18.742h2.678v2.678h-2.678v-2.678zM21.42 18.742h2.677v2.678h-2.678v-2.678zM26.774 18.742h2.678v2.678h-2.678v-2.678zM32.13 18.742h2.677v2.678h-2.678v-2.678zM27.72 31.737l-1.892-1.893-12.44 12.44-1.732-1.73-1.893 1.892 3.624 3.624 14.334-14.333zM25.828 52.602l-12.44 12.44-1.732-1.73-1.893 1.892 3.624 3.624 14.334-14.333-1.893-1.893zM42.839 73.629h2.677v2.677h-2.677V73.63zM25.436 73.629H40.16v2.677H25.435V73.63zM28.113 36.145h17.403v2.678H28.113v-2.678z",
    fill: "#000"
  }));
};

BallotFillIn.defaultProps = {
  width: "83",
  height: "83",
  viewBox: "0 0 83 83",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var Citizens = function Citizens(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#a)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M25.466 58.443l-5.39-2.022a2.625 2.625 0 0 1-1.703-2.457v-2.118h-7.874v2.118a2.625 2.625 0 0 1-1.703 2.457l-5.39 2.022A5.25 5.25 0 0 0 0 63.358v9.485a2.625 2.625 0 0 0 2.625 2.625h26.247v-12.11a5.25 5.25 0 0 0-3.406-4.915z",
    fill: "#E6AF78"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.436 55.783c1.473 0 2.879-.284 4.18-.779-.142-.325-.243-.67-.243-1.04v-2.118h-7.874v2.118c0 .37-.102.715-.244 1.04 1.302.495 2.707.779 4.18.779z",
    fill: "#D29B6E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2.625 75.469h26.247v-12.11a5.25 5.25 0 0 0-3.407-4.916l-5.183-1.944-3.99 3.99a2.625 2.625 0 0 1-3.712 0l-3.99-3.99-5.184 1.944A5.249 5.249 0 0 0 0 63.358v9.486a2.625 2.625 0 0 0 2.625 2.625z",
    fill: "#DBD9DC"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.486 53.159h-.1a9.136 9.136 0 0 1-9.137-9.136v-4.039a9.136 9.136 0 0 1 9.136-9.135h.101a9.136 9.136 0 0 1 9.136 9.135v4.039a9.136 9.136 0 0 1-9.136 9.136z",
    fill: "#F0C087"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.499 43.972v-3.937c0-4.16 2.768-7.671 6.562-8.8A9.187 9.187 0 0 0 5.25 40.035v3.936a9.187 9.187 0 0 0 11.81 8.801c-3.793-1.13-6.561-4.64-6.561-8.8z",
    fill: "#E6AF78"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.096 63.816L.83 60.55A5.23 5.23 0 0 0 0 63.359v9.485a2.625 2.625 0 0 0 2.625 2.624h2.624V66.6a3.937 3.937 0 0 0-1.153-2.784zM13.124 60.895v14.573h2.624V60.894a2.614 2.614 0 0 1-2.624 0z",
    fill: "#EDEBED"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14.436 36.098a5.249 5.249 0 1 0 0-10.497 5.249 5.249 0 0 0 0 10.497z",
    fill: "#6E4B53"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.25 40.035v2.945c1.453-.688 3.233-1.774 4.596-3.39.398-.472 1.079-.569 1.617-.267 1.73.972 5.787 2.824 12.16 3.242v-2.53a9.186 9.186 0 1 0-18.374 0z",
    fill: "#5C414B"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.42 32.344a9.173 9.173 0 0 0-4.17 7.69v2.946c1.453-.689 3.233-1.774 4.596-3.39a1.23 1.23 0 0 1 .798-.423c-.972-1.848-1.731-4.257-1.223-6.823z",
    fill: "#503441"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M89.117 55.172l-6.597-3.054c-.877-.406-1.442-1.311-1.442-2.31V45.13H71.37v4.677c0 1-.565 1.905-1.441 2.31l-6.598 3.055c-1.753.812-2.883 2.623-2.883 4.62v15.676h29.125c1.34 0 2.427-1.132 2.427-2.528V59.793c0-1.998-1.13-3.81-2.883-4.62z",
    fill: "#FAD7A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M89.117 55.172l-6.553-3.033-4.623 4.624a2.427 2.427 0 0 1-3.433 0l-4.624-4.624-6.553 3.033c-1.753.812-2.883 2.623-2.883 4.621V75.47h29.125c1.34 0 2.427-1.132 2.427-2.529V59.793c0-1.998-1.13-3.809-2.883-4.62z",
    fill: "#DBD9DC"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M71.37 45.13v4.677c0 .463-.132.9-.35 1.283a10.855 10.855 0 0 0 5.204 1.321c1.883 0 3.656-.479 5.204-1.321a2.591 2.591 0 0 1-.35-1.283V45.13H71.37z",
    fill: "#F0C891"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M76.224 49.984a8.495 8.495 0 0 1-8.495-8.495v-7.281h16.99v7.281a8.495 8.495 0 0 1-8.495 8.495z",
    fill: "#FFE1B4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M72.584 41.49v-7.282h-4.855v7.281a8.495 8.495 0 0 0 10.922 8.139c-3.508-1.045-6.067-4.291-6.067-8.139z",
    fill: "#FAD7A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M77.438 28.14H75.01a8.495 8.495 0 0 0-8.495 8.495v1.942c0 .899.954 1.51 1.75 1.09 1.23-.65 2.675-1.86 3.645-3.168.392-.527 1.145-.606 1.672-.213 3.851 2.874 9.215 2.213 11.383 1.785.565-.111.966-.612.966-1.188v-.248a8.495 8.495 0 0 0-8.494-8.494z",
    fill: "#D59F63"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M68.265 39.667c1.232-.65 2.676-1.861 3.646-3.168.148-.2.355-.314.576-.384-1.716-2.388-1.833-5.05-1.62-6.892a8.488 8.488 0 0 0-4.351 7.412v1.941c0 .9.954 1.51 1.75 1.09z",
    fill: "#CD915A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M85.932 64.841A3.64 3.64 0 0 1 87 62.267l4.564-4.565c.281.645.437 1.355.437 2.09V72.94c0 1.396-1.087 2.528-2.427 2.528h-3.64V64.841zM75.01 57.138v18.33h2.428v-18.33a2.417 2.417 0 0 1-2.427 0z",
    fill: "#EDEBED"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M61.392 50.194l-8.216-3.804c-1.092-.505-1.795-1.633-1.795-2.877v-5.825H39.29v5.825c0 1.245-.703 2.372-1.795 2.877l-8.216 3.804c-2.183 1.01-3.59 3.266-3.59 5.754V72.32c0 1.739 1.354 3.149 3.023 3.149h33.246c1.67 0 3.022-1.41 3.022-3.149V55.948c0-2.488-1.406-4.743-3.59-5.754z",
    fill: "#B48764"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M28.713 75.469h33.246c1.67 0 3.023-1.41 3.023-3.149V55.948c0-2.488-1.407-4.743-3.59-5.754l-8.16-3.778-5.759 5.759a3.023 3.023 0 0 1-4.274 0l-5.758-5.759-8.16 3.778c-2.184 1.01-3.59 3.265-3.59 5.754V72.32c0 1.739 1.353 3.149 3.022 3.149z",
    fill: "#5D5360"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M39.291 37.688v5.825c0 .577-.164 1.12-.435 1.597a13.517 13.517 0 0 0 6.48 1.646c2.345 0 4.553-.597 6.48-1.646a3.227 3.227 0 0 1-.435-1.597v-5.825H39.29z",
    fill: "#966D50"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M45.336 43.733c-5.842 0-10.578-4.736-10.578-10.578v-9.067h21.157v9.067c0 5.842-4.737 10.578-10.579 10.578z",
    fill: "#C39772"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40.802 33.155v-9.067h-6.044v9.067c0 5.843 4.736 10.578 10.578 10.578a10.57 10.57 0 0 0 3.022-.443c-4.368-1.301-7.556-5.343-7.556-10.135z",
    fill: "#B48764"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M46.848 16.531h-3.023c-5.842 0-10.578 4.736-10.578 10.579v2.417c0 1.12 1.188 1.88 2.178 1.358 1.534-.809 3.332-2.317 4.54-3.945.488-.657 1.427-.754 2.083-.265 4.795 3.579 11.474 2.756 14.175 2.223a1.503 1.503 0 0 0 1.203-1.48v-.308c0-5.843-4.736-10.579-10.578-10.579z",
    fill: "#5C414B"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M35.425 30.886c1.534-.809 3.332-2.318 4.54-3.945.185-.25.443-.391.717-.478-2.136-2.974-2.282-6.29-2.016-8.583-3.232 1.81-5.42 5.263-5.42 9.23v2.418c0 1.12 1.189 1.88 2.18 1.358z",
    fill: "#503441"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33.246 62.235a4.533 4.533 0 0 0-1.327-3.206l-5.684-5.684a6.506 6.506 0 0 0-.545 2.603V72.32c0 1.74 1.354 3.149 3.023 3.149h4.533V62.235zM57.425 62.235c0-1.203.478-2.356 1.328-3.206l5.684-5.684c.35.803.545 1.687.545 2.603V72.32c0 1.74-1.354 3.149-3.023 3.149h-4.534V62.235zM43.825 52.642v22.827h3.022V52.641a3.01 3.01 0 0 1-3.022 0z",
    fill: "#6F6571"
  })), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "a"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M0 0h92v92H0z"
  }))));
};

Citizens.defaultProps = {
  width: "92",
  height: "92",
  viewBox: "0 0 92 92",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var CitizensBuilding = function CitizensBuilding(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#a)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6.552 88.448h81.896V0H6.552v88.448z",
    fill: "#E6EEF3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 95h95v-6.552H0V95z",
    fill: "#CAD3DB"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16.38 18.017h13.103V8.19H16.379v9.828zM16.38 36.035h13.103v-9.828H16.379v9.828zM40.948 36.035h13.104v-9.828H40.948v9.828zM65.517 36.035h13.104v-9.828H65.517v9.828zM40.948 54.051h13.104v-9.827H40.948v9.827zM65.517 54.051h13.104v-9.827H65.517v9.827zM16.38 54.051h13.103v-9.827H16.379v9.827zM40.948 18.017h13.104V8.19H40.948v9.828zM65.517 18.017h13.104V8.19H65.517v9.828zM47.5 88.448h13.103V68.793H47.5v19.655z",
    fill: "#9AABB4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M34.397 88.448H47.5V68.793H34.397v19.655z",
    fill: "#788992"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M57.328 63.88H37.673a1.636 1.636 0 0 1-1.638-1.639c0-.905.732-1.638 1.638-1.638h19.655c.906 0 1.638.733 1.638 1.639 0 .905-.732 1.637-1.638 1.637z",
    fill: "#9AABB4"
  }), /*#__PURE__*/React.createElement("g", {
    clipPath: "url(#b)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M34.712 85.236l-3.772-1.414a1.837 1.837 0 0 1-1.192-1.72v-1.483h-5.511v1.483c0 .765-.475 1.45-1.192 1.72l-3.772 1.414a3.674 3.674 0 0 0-2.384 3.44v6.639c0 1.014.822 1.837 1.837 1.837h18.37v-8.476c0-1.531-.95-2.902-2.384-3.44z",
    fill: "#E6AF78"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26.992 83.375a8.208 8.208 0 0 0 2.927-.545c-.1-.228-.171-.47-.171-.728v-1.483h-5.511v1.483c0 .259-.071.5-.171.728a8.207 8.207 0 0 0 2.926.545z",
    fill: "#D29B6E"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.726 97.152h18.37v-8.475c0-1.532-.95-2.903-2.384-3.44l-3.628-1.361-2.793 2.792a1.837 1.837 0 0 1-2.598 0l-2.792-2.792-3.628 1.36a3.674 3.674 0 0 0-2.384 3.44v6.64c0 1.014.822 1.836 1.837 1.836z",
    fill: "#DBD9DC"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M27.028 81.537h-.071a6.394 6.394 0 0 1-6.394-6.394v-2.826a6.394 6.394 0 0 1 6.394-6.394h.07a6.394 6.394 0 0 1 6.395 6.394v2.826a6.394 6.394 0 0 1-6.394 6.394z",
    fill: "#F0C087"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M24.237 75.108v-2.756a6.43 6.43 0 0 1 4.592-6.16 6.43 6.43 0 0 0-8.267 6.16v2.756a6.43 6.43 0 0 0 8.267 6.16 6.43 6.43 0 0 1-4.592-6.16z",
    fill: "#E6AF78"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.756 88.997l-2.287-2.287a3.66 3.66 0 0 0-.58 1.966v6.639c0 1.014.822 1.837 1.837 1.837h1.837v-6.207c0-.73-.29-1.431-.807-1.948zM26.074 86.952v10.2h1.837v-10.2a1.83 1.83 0 0 1-1.837 0z",
    fill: "#EDEBED"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M26.992 69.597a3.674 3.674 0 1 0 0-7.347 3.674 3.674 0 0 0 0 7.347z",
    fill: "#6E4B53"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20.563 72.352v2.061c1.017-.481 2.263-1.241 3.217-2.372a.9.9 0 0 1 1.131-.187c1.211.68 4.05 1.976 8.51 2.27v-1.772a6.43 6.43 0 0 0-12.858 0z",
    fill: "#5C414B"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23.482 66.97a6.42 6.42 0 0 0-2.92 5.383v2.06c1.018-.481 2.264-1.241 3.218-2.372a.86.86 0 0 1 .559-.296c-.68-1.293-1.212-2.98-.857-4.775z",
    fill: "#503441"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M79.26 82.947l-4.617-2.137a1.774 1.774 0 0 1-1.01-1.617v-3.274H66.84v3.274c0 .699-.395 1.332-1.008 1.617l-4.618 2.137c-1.227.568-2.018 1.836-2.018 3.234v10.971H79.58c.938 0 1.699-.792 1.699-1.77v-9.2c0-1.4-.79-2.667-2.018-3.235z",
    fill: "#FAD7A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M79.26 82.947l-4.586-2.124-3.236 3.237a1.699 1.699 0 0 1-2.403 0L65.8 80.823l-4.586 2.124c-1.227.568-2.018 1.835-2.018 3.233v10.971H79.58c.938 0 1.699-.792 1.699-1.77v-9.2c0-1.4-.79-2.666-2.018-3.234z",
    fill: "#DBD9DC"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M66.84 75.919v3.274c0 .324-.093.63-.245.897a7.597 7.597 0 0 0 3.642.925 7.596 7.596 0 0 0 3.642-.925 1.813 1.813 0 0 1-.245-.897v-3.274H66.84z",
    fill: "#F0C891"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M70.237 79.316a5.945 5.945 0 0 1-5.946-5.946v-5.096h11.89v5.096a5.945 5.945 0 0 1-5.944 5.946z",
    fill: "#FFE1B4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M67.689 73.37v-5.096H64.29v5.096a5.945 5.945 0 0 0 7.644 5.696 5.945 5.945 0 0 1-4.246-5.696z",
    fill: "#FAD7A5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M71.086 64.028h-1.699a5.945 5.945 0 0 0-5.945 5.946v1.358c0 .63.668 1.057 1.225.763.861-.454 1.872-1.302 2.551-2.217.274-.369.802-.424 1.17-.149 2.695 2.011 6.45 1.55 7.967 1.25a.844.844 0 0 0 .676-.832v-.174a5.945 5.945 0 0 0-5.945-5.945z",
    fill: "#D59F63"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M64.666 72.095c.862-.455 1.873-1.303 2.552-2.217a.772.772 0 0 1 .403-.269c-1.2-1.671-1.283-3.535-1.133-4.824a5.94 5.94 0 0 0-3.046 5.188v1.359c0 .629.668 1.056 1.224.763z",
    fill: "#CD915A"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M77.031 89.714c0-.676.269-1.324.746-1.802l3.195-3.194c.197.451.306.948.306 1.463v9.201c0 .978-.76 1.77-1.699 1.77h-2.548v-7.438zM69.388 84.322v12.83h1.698v-12.83a1.692 1.692 0 0 1-1.698 0z",
    fill: "#EDEBED"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M59.856 79.462l-5.75-2.662c-.764-.353-1.257-1.143-1.257-2.013V70.71h-8.46v4.077c0 .87-.493 1.66-1.257 2.013l-5.75 2.662c-1.528.708-2.513 2.286-2.513 4.027v11.459c0 1.217.947 2.203 2.115 2.203h23.269c1.168 0 2.115-.986 2.115-2.203V83.49c0-1.742-.985-3.32-2.512-4.028z",
    fill: "#B48764"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M36.984 97.152h23.269c1.168 0 2.115-.987 2.115-2.204V83.49c0-1.742-.985-3.32-2.512-4.027l-5.711-2.644-4.03 4.03a2.115 2.115 0 0 1-2.992 0l-4.03-4.03-5.711 2.644c-1.528.707-2.513 2.285-2.513 4.027v11.458c0 1.217.947 2.204 2.115 2.204z",
    fill: "#5D5360"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M44.388 70.71v4.077c0 .403-.115.784-.304 1.117a9.46 9.46 0 0 0 4.535 1.152 9.46 9.46 0 0 0 4.535-1.152 2.259 2.259 0 0 1-.305-1.117V70.71h-8.46z",
    fill: "#966D50"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M48.619 74.94a7.404 7.404 0 0 1-7.404-7.403v-6.346h14.807v6.346a7.404 7.404 0 0 1-7.403 7.404z",
    fill: "#C39772"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M45.446 67.537v-6.346h-4.23v6.346a7.404 7.404 0 0 0 9.518 7.093 7.404 7.404 0 0 1-5.288-7.093z",
    fill: "#B48764"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M49.677 55.903H47.56a7.404 7.404 0 0 0-7.403 7.404v1.692c0 .784.831 1.316 1.524.95 1.073-.566 2.332-1.622 3.178-2.76.341-.46.998-.529 1.457-.186 3.357 2.504 8.031 1.929 9.921 1.555.492-.097.842-.533.842-1.035v-.216a7.404 7.404 0 0 0-7.403-7.404z",
    fill: "#5C414B"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M41.682 65.95c1.073-.567 2.332-1.623 3.178-2.762a.963.963 0 0 1 .502-.334c-1.496-2.082-1.598-4.402-1.412-6.007a7.398 7.398 0 0 0-3.793 6.46v1.692c0 .784.832 1.316 1.525.95z",
    fill: "#503441"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M40.157 87.89c0-.842-.334-1.649-.929-2.244l-3.978-3.978a4.554 4.554 0 0 0-.38 1.822v11.459c0 1.216.946 2.203 2.114 2.203h3.173V87.89zM57.08 87.89c0-.842.334-1.649.93-2.244l3.977-3.978c.246.562.381 1.18.381 1.822v11.459c0 1.216-.947 2.203-2.115 2.203H57.08V87.89zM47.56 81.176v15.976h2.116V81.176c-.654.38-1.461.38-2.115 0z",
    fill: "#6F6571"
  }))), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
    id: "a"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M0 0h95v95H0z"
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "b"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    transform: "translate(16.889 44.333)",
    d: "M0 0h64.389v64.389H0z"
  }))));
};

CitizensBuilding.defaultProps = {
  width: "95",
  height: "95",
  viewBox: "0 0 95 95",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var VoteByMail = function VoteByMail(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M1.233 53.032V20.965l19.373 12.693L1.233 53.031zM37 44.4l16.393-10.74 19.374 19.373H1.233L20.606 33.66 37 44.4zM72.767 20.965V53.03L53.393 33.658l19.374-12.693z",
    fill: "#F1C692"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M71.091 21.465H2.91L20.88 33.24 37 43.8l16.12-10.56L71.09 21.465z",
    fill: "#F1C692",
    stroke: "#fff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M0 20.968c0-.037.019-.07.021-.106a1.15 1.15 0 0 1 .05-.247c.021-.08.052-.157.09-.23.018-.032.02-.068.04-.1.027-.03.056-.059.086-.086a1.147 1.147 0 0 1 .365-.303 1.187 1.187 0 0 1 .464-.14.984.984 0 0 1 .117-.022h71.534c.043 0 .08.021.123.025a1.228 1.228 0 0 1 .644.264c.066.054.126.115.18.181.026.033.061.052.085.087.023.034.022.067.04.1.038.073.069.15.09.229.026.08.043.163.05.246 0 .038.021.07.021.107v32.061c0 .681-.552 1.234-1.233 1.234H1.233A1.233 1.233 0 0 1 0 53.034V20.968zm71.533 2.283L55.337 33.858l16.196 16.199V23.251zM37 42.92L68.632 22.2H5.362L37 42.921zm16.23-7.684L37.677 45.428c-.015.01-.031.013-.046.022-.066.037-.136.07-.208.096-.034.012-.066.028-.1.038-.1.027-.203.042-.307.043l-.015.007h-.014a1.2 1.2 0 0 1-.306-.043c-.035-.01-.067-.026-.1-.038a1.25 1.25 0 0 1-.209-.096c-.015-.009-.031-.011-.046-.021L20.77 35.243 4.211 51.8h65.578L53.231 35.237zm-34.567-1.38L2.467 23.25v26.806l16.196-16.2z",
    fill: "#5D5360"
  }));
};

VoteByMail.defaultProps = {
  width: "74",
  height: "74",
  viewBox: "0 0 74 74",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var NullTimes = function NullTimes(props) {
  return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
    d: "M38.5 0C17.27 0 0 17.27 0 38.5S17.27 77 38.5 77 77 59.73 77 38.5 59.73 0 38.5 0z",
    fill: "#5D5360"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M52.678 48.141a3.206 3.206 0 0 1 0 4.537 3.2 3.2 0 0 1-2.269.94 3.2 3.2 0 0 1-2.268-.94l-9.64-9.641-9.642 9.641a3.2 3.2 0 0 1-2.268.94 3.2 3.2 0 0 1-2.269-.94 3.206 3.206 0 0 1 0-4.537l9.642-9.64-9.642-9.641a3.206 3.206 0 0 1 0-4.537 3.206 3.206 0 0 1 4.537 0l9.641 9.641 9.641-9.641a3.206 3.206 0 0 1 4.537 0 3.206 3.206 0 0 1 0 4.537l-9.642 9.64 9.642 9.641z",
    fill: "#FAFAFA"
  }));
};

NullTimes.defaultProps = {
  width: "77",
  height: "77",
  viewBox: "0 0 77 77",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg"
};

var ShowcaseItem$1 = (_ref) => {
  var classes = _ref.classes,
      icon = _ref.icon,
      value = _ref.value,
      children = _ref.children;
  return /*#__PURE__*/React.createElement("div", {
    className: classes.showcaseItem
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.showcaseIcon
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: classes.showcaseContainer
  }, /*#__PURE__*/React.createElement(Heading2, {
    className: classes.showcaseValue
  }, formatGroupedNumber(value)), /*#__PURE__*/React.createElement(DivBodyHuge, {
    className: classes.showcaseText
  }, children)));
};

var ElectionResultsProcess = themable("ElectionResultsProcess", cssClasses$j)((_ref2) => {
  var results = _ref2.results,
      classes = _ref2.classes;
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, results.eligibleVoters != null && /*#__PURE__*/React.createElement(ShowcaseItem$1, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(Citizens, null),
    value: results.eligibleVoters
  }, "Total aleg\u0103tori \xEEnscri\u0219i \xEEn liste"), results.votesByMail != null && /*#__PURE__*/React.createElement(ShowcaseItem$1, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(VoteByMail, null),
    value: results.votesByMail
  }, "Total voturi prin coresponden\u021B\u0103"), /*#__PURE__*/React.createElement(ShowcaseItem$1, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(CitizensBuilding, null),
    value: results.totalVotes
  }, "Total aleg\u0103tori prezen\u021Bi la urne"), /*#__PURE__*/React.createElement(ShowcaseItem$1, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(BallotFillIn, null),
    value: results.validVotes
  }, "Total voturi valabil exprimate"), /*#__PURE__*/React.createElement(ShowcaseItem$1, {
    classes: classes,
    icon: /*#__PURE__*/React.createElement(NullTimes, null),
    value: results.nullVotes
  }, "Total voturi nule"));
});

var css_248z$k = ".ElectionTimeline-module_root__30jlA{color:#505050;user-select:none;-webkit-user-select:none}.ElectionTimeline-module_yearRow__jA-8C{font-size:1.5rem;padding-left:2.5rem;padding-top:.375rem;padding-bottom:.375rem}.ElectionTimeline-module_electionRow__3zvtD{padding-left:2.5rem}.ElectionTimeline-module_ballotRow__2Povt{padding-left:4.3rem}.ElectionTimeline-module_ballotTitle__3AaNM,.ElectionTimeline-module_electionRow__3zvtD{font-size:1.125rem;padding-top:.25rem;padding-bottom:.25rem;cursor:pointer}.ElectionTimeline-module_selectedBallot__2FB3g,.ElectionTimeline-module_selectedElection__2qA-2,.ElectionTimeline-module_selectedYear__WQG4Q{font-weight:600}.ElectionTimeline-module_year__rLsBx{position:relative}.ElectionTimeline-module_yearLine__3Cfl7{position:absolute;left:1.5rem;top:1.125rem;width:1px;height:100%;background-color:currentColor;transform:translate(-50%)}.ElectionTimeline-module_yearDot__Vf4fj{position:absolute;left:1.5rem;top:1.125rem;width:.75rem;height:.75rem;border-radius:50%;border:1px solid;background-color:#fff;transform:translate(-50%,-50%)}.ElectionTimeline-module_selectedYearDot__2i9RO{background-color:currentColor}.ElectionTimeline-module_electionRow__3zvtD{display:flex;flex-direction:row;align-items:center}.ElectionTimeline-module_live__2YE1Q{flex-shrink:0;background-color:#e53935;font-weight:600;color:#fff;padding:.25rem;border-radius:.25rem;font-size:.875rem;margin-left:.5rem}.ElectionTimeline-module_collapseWidget__N7-xX{width:.7rem;margin-right:.2rem;flex-shrink:0}.ElectionTimeline-module_collapseCaret__rDDIK{height:.7rem;transition:transform .15s ease-out;opacity:.8}.ElectionTimeline-module_collapseCaretExpanded__1obxx{transform:rotate(90deg)}";
var cssClasses$k = {
  "root": "ElectionTimeline-module_root__30jlA",
  "yearRow": "ElectionTimeline-module_yearRow__jA-8C",
  "electionRow": "ElectionTimeline-module_electionRow__3zvtD",
  "ballotRow": "ElectionTimeline-module_ballotRow__2Povt",
  "ballotTitle": "ElectionTimeline-module_ballotTitle__3AaNM",
  "selectedYear": "ElectionTimeline-module_selectedYear__WQG4Q",
  "selectedElection": "ElectionTimeline-module_selectedElection__2qA-2",
  "selectedBallot": "ElectionTimeline-module_selectedBallot__2FB3g",
  "year": "ElectionTimeline-module_year__rLsBx",
  "yearLine": "ElectionTimeline-module_yearLine__3Cfl7",
  "yearDot": "ElectionTimeline-module_yearDot__Vf4fj",
  "selectedYearDot": "ElectionTimeline-module_selectedYearDot__2i9RO",
  "live": "ElectionTimeline-module_live__2YE1Q",
  "collapseWidget": "ElectionTimeline-module_collapseWidget__N7-xX",
  "collapseCaret": "ElectionTimeline-module_collapseCaret__rDDIK",
  "collapseCaretExpanded": "ElectionTimeline-module_collapseCaretExpanded__1obxx"
};
styleInject(css_248z$k);

var dateComparator = (a, b) => {
  return parseISO(b.date).getTime() - parseISO(a.date).getTime();
};

var ElectionTimeline = themable("ElectionTimeline", cssClasses$k)((_ref) => {
  var classes = _ref.classes,
      items = _ref.items,
      selectedBallotId = _ref.selectedBallotId,
      onSelectBallot = _ref.onSelectBallot;
  var years = useMemo(() => {
    var sortedItems = [...items];
    sortedItems.sort(dateComparator);
    var yearsArray = [];
    var lastYear;
    var electionsById;
    sortedItems.forEach(meta => {
      var metaYear = parseISO(meta.date).getFullYear();

      if (metaYear !== lastYear) {
        lastYear = metaYear;
        electionsById = new Map();
        yearsArray.push({
          year: metaYear,
          elections: []
        });
      }

      var currentYear = yearsArray[yearsArray.length - 1];
      var electionId = meta.electionId;
      var election = electionsById.get(electionId);

      if (!election) {
        election = {
          electionId,
          title: meta.title,
          live: !!meta.live,
          ballots: []
        };
        currentYear.elections.push(election);
        electionsById.set(electionId, election);
      }

      election.ballots.push(meta);
    });
    return yearsArray;
  }, [items]);

  var _useMemo = useMemo(() => {
    if (selectedBallotId == null) return [null, null];
    var meta = items.find(m => m.ballotId === selectedBallotId);
    if (!meta) return [null, null];
    return [meta.electionId, parseISO(meta.date).getFullYear()];
  }, [items, selectedBallotId]),
      _useMemo2 = _slicedToArray(_useMemo, 2),
      selectedElectionId = _useMemo2[0],
      selectedYear = _useMemo2[1];

  var _useState = useState(() => new Set()),
      _useState2 = _slicedToArray(_useState, 2),
      expandedElections = _useState2[0],
      setExpandedElections = _useState2[1];

  useEffect(() => {
    setExpandedElections(set => {
      if (selectedElectionId == null || set.has(selectedElectionId)) return set;
      var newSet = new Set(set);
      newSet.add(selectedElectionId);
      return newSet;
    });
  }, [selectedElectionId]);

  var onElectionClick = election => () => {
    if (election.ballots.length === 1) {
      if (onSelectBallot) {
        onSelectBallot(election.ballots[0]);
      }

      return;
    }

    var electionId = election.electionId;
    setExpandedElections(set => {
      var newSet = new Set(set);

      if (set.has(electionId)) {
        newSet.delete(electionId);
      } else {
        newSet.add(electionId);
      }

      return newSet;
    });
  };

  var onBallotClick = meta => () => {
    if (onSelectBallot) {
      onSelectBallot(meta);
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, years.map(year => /*#__PURE__*/React.createElement("div", {
    key: year.year,
    className: classes.year
  }, /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.yearRow, selectedYear === year.year && classes.selectedYear)
  }, year.year), year.elections.map(election => /*#__PURE__*/React.createElement("div", {
    key: election.electionId,
    className: classes.election
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.electionRow,
    onClick: onElectionClick(election)
  }, /*#__PURE__*/React.createElement("div", {
    className: classes.collapseWidget
  }, election.ballots.length > 1 && /*#__PURE__*/React.createElement("svg", {
    className: mergeClasses(classes.collapseCaret, expandedElections.has(election.electionId) && classes.collapseCaretExpanded),
    viewBox: "0 0 7 10"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 0 L 0 10 L 7 5 L 0 0",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.electionTitle, selectedElectionId === election.electionId && classes.selectedElection)
  }, election.title), election.live && /*#__PURE__*/React.createElement("div", {
    className: classes.live
  }, "LIVE")), expandedElections.has(election.electionId) && election.ballots.length >= 2 && election.ballots.map((meta, index) => /*#__PURE__*/React.createElement("div", {
    key: meta.ballotId,
    className: classes.ballotRow,
    onClick: onBallotClick(meta)
  }, /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.ballotTitle, selectedBallotId === meta.ballotId && classes.selectedBallot)
  }, meta.ballot || "".concat(meta.title, " ").concat(index + 1)))))), /*#__PURE__*/React.createElement("div", {
    className: classes.yearLine
  }), /*#__PURE__*/React.createElement("div", {
    className: mergeClasses(classes.yearDot, selectedYear === year.year && classes.selectedYearDot)
  }))));
});

var css_248z$l = ".ElectionScopePicker-module_root__3fEks{display:flex;flex-direction:row;align-items:flex-end;flex-wrap:wrap}.ElectionScopePicker-module_typeSelect__3zIHV{margin-top:.8rem;margin-right:2rem;margin-bottom:.5rem;width:11rem}.ElectionScopePicker-module_selects__3Uo-J{margin-left:-.5rem;display:flex;flex-direction:row;flex-wrap:wrap}.ElectionScopePicker-module_selectContainer__hBe-s{width:15rem;margin-left:.5rem;margin-bottom:.5rem;display:flex;flex-direction:column;align-items:stretch}@media (max-width:480px){.ElectionScopePicker-module_root__3fEks{flex-direction:column;align-items:stretch;flex-wrap:nowrap}.ElectionScopePicker-module_typeSelect__3zIHV{margin-top:0}.ElectionScopePicker-module_selects__3Uo-J{flex-direction:column;margin-left:0;align-items:stretch;flex-wrap:nowrap}.ElectionScopePicker-module_selectContainer__hBe-s{margin-left:0;width:100%}}";
var cssClasses$l = {
  "root": "ElectionScopePicker-module_root__3fEks",
  "typeSelect": "ElectionScopePicker-module_typeSelect__3zIHV",
  "selects": "ElectionScopePicker-module_selects__3Uo-J",
  "selectContainer": "ElectionScopePicker-module_selectContainer__hBe-s"
};
styleInject(css_248z$l);

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var electionScopePickerUpdateType = (scope, type) => {
  var _scope$countryId, _scope$countyId, _scope$countyId2, _scope$localityId;

  if (scope.type === type || type === "diaspora" && scope.type === "diaspora_country" && scope.countryId != null) {
    return scope;
  }

  switch (type) {
    case "national":
      return {
        type: "national"
      };

    case "diaspora":
      return {
        type: "diaspora"
      };

    case "diaspora_country":
      return {
        type: "diaspora_country",
        countryId: (_scope$countryId = scope === null || scope === void 0 ? void 0 : scope.countryId) !== null && _scope$countryId !== void 0 ? _scope$countryId : null
      };

    case "county":
      return {
        type: "county",
        countyId: (_scope$countyId = scope === null || scope === void 0 ? void 0 : scope.countyId) !== null && _scope$countyId !== void 0 ? _scope$countyId : null
      };

    case "locality":
      return {
        type: "locality",
        countyId: (_scope$countyId2 = scope === null || scope === void 0 ? void 0 : scope.countyId) !== null && _scope$countyId2 !== void 0 ? _scope$countyId2 : null,
        localityId: (_scope$localityId = scope === null || scope === void 0 ? void 0 : scope.localityId) !== null && _scope$localityId !== void 0 ? _scope$localityId : null
      };
  }
};
var useElectionScopePickerApi = (api, scope) => {
  var _ref;

  var shouldQueryCounty = scope.type === "county" || scope.type === "locality";
  var countyData = useApiResponse(() => shouldQueryCounty ? api.getCounties() : null, [api, shouldQueryCounty]);
  var queryCountyId = (_ref = scope.type === "locality" ? scope.countyId : null) !== null && _ref !== void 0 ? _ref : null;
  var localityData = useApiResponse(() => queryCountyId != null ? {
    invocation: api.getLocalities(queryCountyId),
    discardPreviousData: true
  } : null, [api, queryCountyId]);
  var shouldQueryCountry = scope.type === "diaspora" || scope.type === "diaspora_country";
  var countryData = useApiResponse(() => shouldQueryCountry ? api.getCountries() : null, [api, shouldQueryCountry]);
  return {
    countyData,
    localityData,
    countryData
  };
};

function resolveValue(x) {
  var _x$, _ref2;

  if (Array.isArray(x)) return (_x$ = x[0]) === null || _x$ === void 0 ? void 0 : _x$.id;
  return (_ref2 = typeof x === "object" ? x === null || x === void 0 ? void 0 : x.id : x) !== null && _ref2 !== void 0 ? _ref2 : null;
}

var resolveInMap = (id, map) => {
  var _map$get;

  return id == null ? null : {
    id,
    name: ((_map$get = map.get(id)) === null || _map$get === void 0 ? void 0 : _map$get.name) || ""
  };
};

var buildMap = list => {
  var map = new Map();

  if (list) {
    list.forEach(item => {
      map.set(item.id, item);
    });
  }

  return map;
};

var useElectionScopePickerGetSelectProps = (apiData, scope, onChangeScope) => {
  var countyMap = useMemo(() => buildMap(apiData.countyData.data), [apiData.countyData.data]);
  var localityMap = useMemo(() => buildMap(apiData.localityData.data), [apiData.localityData.data]);
  var countryMap = useMemo(() => buildMap(apiData.countyData.data), [apiData.countryData.data]);
  var onCountyChange = useCallback(value => {
    var _scope$countyId3, _scope$countyId4;

    var countyId = resolveValue(value);

    if (scope.type === "county" && countyId !== ((_scope$countyId3 = scope.countyId) !== null && _scope$countyId3 !== void 0 ? _scope$countyId3 : null)) {
      onChangeScope({
        type: "county",
        countyId
      });
    } else if (scope.type === "locality" && countyId !== ((_scope$countyId4 = scope.countyId) !== null && _scope$countyId4 !== void 0 ? _scope$countyId4 : null)) {
      onChangeScope({
        type: "locality",
        countyId,
        localityId: null
      });
    }
  }, [scope, onChangeScope]);
  var onLocalityChange = useCallback(value => {
    var _scope$localityId2;

    var localityId = resolveValue(value);

    if (scope.type === "locality" && localityId !== ((_scope$localityId2 = scope.localityId) !== null && _scope$localityId2 !== void 0 ? _scope$localityId2 : null)) {
      onChangeScope({
        type: "locality",
        countyId: scope.countyId,
        localityId
      });
    }
  }, [scope, onChangeScope]);
  var onCountryChange = useCallback(value => {
    var countryId = resolveValue(value);

    if (countryId == null) {
      if (scope.type === "diaspora_country") {
        onChangeScope({
          type: "diaspora"
        });
      }
    } else {
      var _scope$countryId2;

      if (scope.type === "diaspora" || scope.type === "diaspora_country" && countryId !== ((_scope$countryId2 = scope.countryId) !== null && _scope$countryId2 !== void 0 ? _scope$countryId2 : null)) {
        onChangeScope({
          type: "diaspora_country",
          countryId
        });
      }
    }
  }, [scope, onChangeScope]);
  var selects = [];

  if (scope.type === "county" || scope.type === "locality") {
    var _apiData$countyData$d;

    selects.push({
      label: "Județ",
      selectProps: {
        value: resolveInMap(scope.countyId, countyMap),
        onChange: onCountyChange,
        options: (_apiData$countyData$d = apiData.countyData.data) !== null && _apiData$countyData$d !== void 0 ? _apiData$countyData$d : [],
        isLoading: apiData.countyData.loading,
        isDisabled: false,
        placeholder: "Selectează un județ"
      }
    });
  }

  if (scope.type === "locality") {
    var _apiData$localityData;

    selects.push({
      label: "Localitate",
      selectProps: {
        value: resolveInMap(scope.localityId, localityMap),
        onChange: onLocalityChange,
        options: (_apiData$localityData = apiData.localityData.data) !== null && _apiData$localityData !== void 0 ? _apiData$localityData : [],
        isLoading: apiData.localityData.loading,
        isDisabled: scope.countyId == null,
        placeholder: "Selectează o localitate"
      }
    });
  }

  if (scope.type === "diaspora" || scope.type === "diaspora_country") {
    var _apiData$countryData$;

    selects.push({
      label: "Țară",
      selectProps: {
        value: resolveInMap(scope.type === "diaspora_country" ? scope.countryId : null, countryMap),
        onChange: onCountryChange,
        options: (_apiData$countryData$ = apiData.countryData.data) !== null && _apiData$countryData$ !== void 0 ? _apiData$countryData$ : [],
        isLoading: apiData.countryData.loading,
        isDisabled: false,
        placeholder: "Selectează o țară"
      }
    });
  }

  return selects;
};

function getOptionLabel(_ref3) {
  var name = _ref3.name;
  return name;
}

function getOptionValue(_ref4) {
  var id = _ref4.id;
  return id.toString();
}

var typeNames = {
  national: "Național",
  county: "Județ",
  locality: "Localitate",
  diaspora: "Diaspora"
};
var typeOptions = [{
  id: "national",
  name: typeNames.national
}, {
  id: "county",
  name: typeNames.county
}, {
  id: "locality",
  name: typeNames.locality
}, {
  id: "diaspora",
  name: typeNames.diaspora
}];
var useElectionScopePickerGetTypeSelectProps = (scope, onChangeScope) => {
  var onTypeChange = useCallback(value => {
    var type = resolveValue(value);
    if (type === null) return;
    var newScope = electionScopePickerUpdateType(scope, type);

    if (newScope !== scope) {
      onChangeScope(newScope);
    }
  }, [scope, onChangeScope]);
  var value = scope.type === "diaspora_country" ? "diaspora" : scope.type;
  return {
    label: "Diviziune",
    selectProps: {
      value: {
        id: value,
        name: typeNames[value]
      },
      onChange: onTypeChange,
      options: typeOptions,
      isLoading: false,
      isDisabled: false
    }
  };
};

var loadingMessage = () => "Se încarcă...";

var typeSelectStyles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: provided => _objectSpread$3(_objectSpread$3({}, provided), {}, {
    borderColor: "transparent",
    borderWidth: 0,
    cursor: "pointer"
  }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valueContainer: provided => _objectSpread$3(_objectSpread$3({}, provided), {}, {
    fontWeight: 600,
    fontSize: "".concat(30 / 16, "rem"),
    paddingLeft: 0
  }),
  indicatorSeparator: () => ({
    display: "none"
  })
};
var ElectionScopePicker = themable("ElectionScopePicker", cssClasses$l)((_ref5) => {
  var classes = _ref5.classes,
      apiData = _ref5.apiData,
      value = _ref5.value,
      onChange = _ref5.onChange;
  var typeSelect = useElectionScopePickerGetTypeSelectProps(value, onChange);
  var selects = useElectionScopePickerGetSelectProps(apiData, value, onChange);
  var theme = useTheme();
  var selectTheme = useMemo( // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => t => _objectSpread$3(_objectSpread$3({}, t), {}, {
    colors: _objectSpread$3(_objectSpread$3({}, t.colors), {}, {
      primary: theme.colors.primary,
      primary75: theme.colors.primary75,
      primary50: theme.colors.primary50,
      primary25: theme.colors.primary25
    })
  }), [theme]);
  return /*#__PURE__*/React.createElement("div", {
    className: classes.root
  }, /*#__PURE__*/React.createElement(Select, Object.assign({}, typeSelect.selectProps, {
    isSearchable: false,
    getOptionLabel: getOptionLabel,
    getOptionValue: getOptionValue,
    theme: selectTheme,
    className: classes.typeSelect,
    styles: typeSelectStyles
  })), /*#__PURE__*/React.createElement("div", {
    className: classes.selects
  }, selects.map((_ref6, index) => {
    var label = _ref6.label,
        selectProps = _ref6.selectProps;
    return /*#__PURE__*/React.createElement("div", {
      key: index,
      className: classes.selectContainer
    }, /*#__PURE__*/React.createElement(Label, {
      className: classes.selectLabel
    }, label), /*#__PURE__*/React.createElement(Select, Object.assign({}, selectProps, {
      isClearable: true,
      getOptionLabel: getOptionLabel,
      getOptionValue: getOptionValue,
      theme: selectTheme,
      className: classes.select,
      loadingMessage: loadingMessage
    })));
  })));
});

export { BarChart, Body, BodyHuge, BodyLarge, BodyMedium, Button, ColoredSquare, DivBody, DivBodyHuge, DivBodyLarge, DivBodyMedium, DivHeading1, DivHeading2, DivHeading3, DivLabel, DivLabelMedium, ElectionMap, ElectionObservationSection, ElectionResultsProcess, ElectionResultsSeats, ElectionResultsStackedBar, ElectionResultsSummarySection, ElectionResultsSummaryTable, ElectionResultsTableSection, ElectionScopePicker, ElectionTimeline, ElectionTurnoutSection, Heading1, Heading2, Heading3, HereMap, HereMapsAPIKeyContext, HereMapsAPIKeyProvider, HorizontalStackedBar, Label, LabelMedium, PartyResultCard, PartyResultInline, PercentageBars, PercentageBarsLegend, ResultsTable, ThemeProvider, Underlined, electionApiProductionUrl, electionHasSeats, electionMapOverlayUrl, electionScopeIsComplete, electionScopePickerUpdateType, electionTypeHasSeats, electionTypeInvolvesDiaspora, jsonFetch, makeElectionApi, makeJsonFetch, makeTypographyComponent, mergeClasses, mergeThemeClasses, mergeThemeConstants, mockFetch, overrideClasses, romaniaMapBounds, themable, transformApiInvocation, useApiResponse, useElectionScopePickerApi, useElectionScopePickerGetSelectProps, useElectionScopePickerGetTypeSelectProps, useTheme, worldMapBounds };
//# sourceMappingURL=index.js.map
