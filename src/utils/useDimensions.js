import { useState, useCallback, useLayoutEffect } from "react";

//makes sense as a 'use' effect because something happens based on a window size change

export const getDimensionObject = node => {
  const rect = node.getBoundingClientRect();

  return rect.toJSON();
};

// const useDimensions = () => {
//   const getBoundingClientRect = useBoundingclientrect()

//   useLayoutEffect(())
// };

const useDimensions = () => {
  const [dimensions, setDimensions] = useState({});
  const [node, setNode] = useState(null);

  const ref = useCallback(node => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(getDimensionObject(node))
        );
      measure();

      window.addEventListener("resize", measure);
      window.addEventListener("scroll", measure);

      return () => {
        window.removeEventListener("resize", measure);
        window.removeEventListener("scroll", measure);
      };
    }
  }, [node]);

  return [ref, dimensions, node];
};

export default useDimensions;
