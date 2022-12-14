import produce, * as immer from 'immer';
import React from 'react';

// in logs store we update logs in place
// outside of immer produce
// this is just workaround
immer.setAutoFreeze(false);

const {
  createContext,
  memo,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  useContext,
  useState,
} = React;

export { immer };

const StateContext = createContext(null);
const DispatchContext = createContext(null);
const ActionsContext = createContext(null);

export function useStoreState() {
  return useContext(StateContext);
}

export function useStoreDispatch() {
  return useContext(DispatchContext);
}

export function useStoreActions() {
  return useContext(ActionsContext);
}

// boundActionCreators
export default function Provider({ initialState, actions = {}, children }) {
  const stateRef = useRef(initialState);
  const [state, setState] = useState(initialState);
  const getState = useCallback(() => stateRef.current, []);
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      (window as any).getState2 = getState;
    }
  }, [getState]);
  const dispatch = useCallback(
    (actionId, fn) => {
      // console.log("dispatch",actionId,fn)
      if (typeof actionId === 'function') return actionId(dispatch, getState);

      const stateNext = produce(getState(), fn);
      if (stateNext !== stateRef.current) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(actionId, stateNext);
        }
        stateRef.current = stateNext;
        setState(stateNext);
      }
      // console.log("dispatch",actionId, stateNext);
    },
    [getState]
  );
  const boundActions = useMemo(() => bindActions(actions, dispatch), [
    actions,
    dispatch,
  ]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <ActionsContext.Provider value={boundActions}>
          {children}
        </ActionsContext.Provider>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export function connect(mapStateToProps) {
  return (Component) => {
    const MemoComponent = memo(Component);
    function Connected(props) {
      const state = useContext(StateContext);
      const dispatch = useContext(DispatchContext);
      const mapped = mapStateToProps(state, props);
      const nextProps = { dispatch, ...props, ...mapped };
      return <MemoComponent {...nextProps} />;
    }
    return Connected;
  };
}

// steal from https://github.com/reduxjs/redux/blob/master/src/bindActionCreators.ts
function bindAction(action, dispatch) {
  return function (...args) {
    // console.log("action",action)
    // @ts-expect-error ts-migrate(2683) FIXME: 'this' implicitly has type 'any' because it does n... Remove this comment to see the full error message
    return dispatch(action.apply(this, args));
  };
}

function bindActions(actions, dispatch) {
  const boundActions = {};
  for (const key in actions) {
    // console.log("bindActions",key)
    const action = actions[key];
    if (typeof action === 'function') {
      boundActions[key] = bindAction(action, dispatch);
    } else if (typeof action === 'object') {
      // console.log("bindActions",key, "is an object call bindActions")
      boundActions[key] = bindActions(action, dispatch);
    }
  }
  return boundActions;
}
