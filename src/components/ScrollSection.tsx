"use client";

import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  ReactNode,
} from "react";

interface ScrollSectionProps {
  heroRef: React.RefObject<HTMLElement | null>;
  backgroundImage: string;
  fadeHeight?: number; // px
  children: ReactNode;
}

export default function ScrollSection({
  heroRef,
  backgroundImage,
  fadeHeight = 50,
  children,
}: ScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [heroBottomOffset, setHeroBottomOffset] = useState(0);
  const [locked, setLocked] = useState(false);
  const [active, setActive] = useState(false); // whether scroll section is in view/active

  // Measure hero bottom offset & container height
  const updateHeights = useCallback(() => {
    const heroEl = heroRef?.current;
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      const scrollY = window.scrollY;
      const heroOffsetTop = scrollY + rect.top;
      const heroHeight = rect.height;
      const heroBottom = heroOffsetTop + heroHeight;
      const vh = window.innerHeight;
      
      // Calculate content height more intelligently
      // Use the inner content actual height if available, otherwise estimate
      const contentEl = document.querySelector('.inner-content');
      let contentHeight = vh * 2; // default fallback
      
      if (contentEl) {
        contentHeight = contentEl.scrollHeight;
      }
      
      // Container height should accommodate content plus some buffer, but not be excessive
      const newContainerH = Math.min(Math.max(contentHeight + 200, vh * 1.5), vh * 2.5);
      
      console.log("Debug measurements:", {
        heroBottomOffset: heroBottom,
        containerHeight: newContainerH,
        contentHeight: contentEl?.scrollHeight || 'not available',
        heroHeight,
        viewportHeight: vh
      });
      setContainerHeight(newContainerH);
      setHeroBottomOffset(heroBottom);
    }
  }, [heroRef]);

  // Initial measurement with useLayoutEffect
  useLayoutEffect(() => {
    updateHeights();
  }, [updateHeights]);

  // Initial & resize & hero resize observer
  useEffect(() => {
    window.addEventListener("resize", updateHeights);
    let ro: ResizeObserver | null = null;
    if (heroRef.current && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateHeights());
      ro.observe(heroRef.current);
    }
    return () => {
      window.removeEventListener("resize", updateHeights);
      if (ro && heroRef.current) {
        ro.unobserve(heroRef.current);
        ro.disconnect();
      }
      document.body.style.overflow = "";
    };
  }, [heroRef, updateHeights]);

  // Handle window scroll: lock/unlock + set active
  useEffect(() => {
    const onWindowScroll = () => {
      const scrollY = window.scrollY;
      const sectionStart = heroBottomOffset;
      const sectionEnd = heroBottomOffset + containerHeight;
      const viewportBottom = scrollY + window.innerHeight;
      const isNowActive =
        viewportBottom > sectionStart && scrollY < sectionEnd;
      
      if (isNowActive !== active) setActive(isNowActive);
  
      if (!locked && isNowActive) {
        document.body.style.overflow = "hidden";
        setLocked(true);
        containerRef.current?.focus();
      }
      if (locked && !isNowActive) {
        document.body.style.overflow = "";
        setLocked(false);
      }
    };
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    onWindowScroll();
    return () => {
      window.removeEventListener("scroll", onWindowScroll);
      document.body.style.overflow = "";
    };
  }, [heroBottomOffset, containerHeight, locked, active]);
  
  // Wheel & touch handling inside container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if (e.deltaY > 0) {
        // down
        if (!atBottom) {
          e.preventDefault();
          container.scrollBy({ top: e.deltaY, behavior: "auto" });
        } else if (locked) {
          document.body.style.overflow = "";
          setLocked(false);
          // let page scroll
          // no preventDefault
        }
      } else if (e.deltaY < 0) {
        // up
        if (!atTop) {
          e.preventDefault();
          container.scrollBy({ top: e.deltaY, behavior: "auto" });
        } else if (locked) {
          document.body.style.overflow = "";
          setLocked(false);
        }
      }
    };

    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY; // positive → scroll down
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight;

      if (deltaY > 0) {
        // scroll down
        if (!atBottom) {
          e.preventDefault();
          container.scrollBy({ top: deltaY, behavior: "auto" });
        } else if (locked) {
          document.body.style.overflow = "";
          setLocked(false);
        }
      } else if (deltaY < 0) {
        // scroll up
        if (!atTop) {
          e.preventDefault();
          container.scrollBy({ top: deltaY, behavior: "auto" });
        } else if (locked) {
          document.body.style.overflow = "";
          setLocked(false);
        }
      }
      startY = currentY;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [locked]);

  return (
    <>
      <div className="scroll-section-wrapper">
        {/* Only render background when active */}
        {active && (
          <div
            className="bg-wrapper"
            style={{
              position: "fixed",
              top: `${heroBottomOffset}px`,
              left: 0,
              width: "100%",
              height: `${containerHeight}px`,
              backgroundImage: `url('${backgroundImage}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "rgba(0,0,0,0.1)",
              filter: "brightness(1)",
              zIndex: -1,
              opacity: 1,
              transform: "translateZ(0)", // Force GPU acceleration
              backfaceVisibility: "hidden", // Prevent blur on transform
              WebkitBackfaceVisibility: "hidden",
              willChange: "transform", // Optimize for animations
            }}
          />
        )}

        {/* Scrollable container */}
        <div
          ref={containerRef}
          className="content-wrapper"
          style={{
            position: "relative",
            zIndex: 1,
            height: `${containerHeight}px`,
            overflowY: "auto",
            overscrollBehavior: "contain",
            backgroundColor: "transparent",
          }}
          tabIndex={0}
        >
          {/* Top fade */}
          <div
            className="fade-top"
            style={{
              position: "sticky",
              top: 0,
              height: `${fadeHeight}px`,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0))",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
          {/* Content */}
          <div className="inner-content">{children}</div>
          {/* Bottom fade */}
          <div
            className="fade-bottom"
            style={{
              position: "sticky",
              bottom: 0,
              height: `${fadeHeight}px`,
              background:
                "linear-gradient(to top, rgba(255,255,255,0.8), rgba(255,255,255,0))",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </div>
    </>
  );
}
