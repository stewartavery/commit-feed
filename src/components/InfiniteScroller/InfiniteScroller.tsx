import { useEffect } from "react";

// Value to invoke fetchNext if scroll position surpasses
const SCROLL_RATIO = 0.7;

/**
 * Custom hook that creates scroll listener to calculate scroll position relative to the
 * viewport height. If the position passes the `SCROLL_RATIO` threshold it will invoke the
 * fetchNext callback.
 *
 * **Known bug**: if the viewport is tall enough to contain the initial set of rows without
 * creating overflow this logic may not work properly.
 * @param scrollRef
 * @param fetchNext
 */
function useFetchNextOnScroll(
  scrollRef: React.MutableRefObject<HTMLDivElement | null>,
  fetchNext: () => void
): void {
  useEffect(() => {
    if (!scrollRef?.current) {
      return;
    }

    const scrollElement = scrollRef.current;

    const handleScroll = () => {
      // TODO: optimization — throttle events to reduce invocations
      if (!scrollRef.current) {
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const scrollPercentage = scrollTop / (scrollHeight - clientHeight);

      if (scrollPercentage >= SCROLL_RATIO) {
        fetchNext();
      }
    };

    scrollElement.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [scrollRef, fetchNext]);
}

interface Props<Item> {
  readonly items: Item[];
  readonly renderer: (item: Item) => JSX.Element;
  readonly scrollRef: React.MutableRefObject<HTMLDivElement | null>;
  readonly fetchNext: () => void;
}

/**
 * Component that handles lazy loading of a data collection on scroll. Does not
 * support virtualization.
 */
export function InfiniteScroller<Item>({
  items,
  renderer,
  scrollRef,
  fetchNext,
}: Props<Item>) {
  useFetchNextOnScroll(scrollRef, fetchNext);
  return <>{items.map((item) => renderer(item))}</>;
}
