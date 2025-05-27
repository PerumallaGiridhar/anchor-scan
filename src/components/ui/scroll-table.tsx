import { forwardRef } from "react"
import { useEffect, useRef, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "./button"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"

export const ScrollableTableWrapper = forwardRef<
  HTMLDivElement, { children: React.ReactNode, isFetching?: boolean }>(({ children, isFetching }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const [atBottom, setAtBottom] = useState(false)

    useEffect(() => {
      const el = containerRef.current
      if (!el) return
      const checkOverflow = () => {
        setIsOverflowing(el.scrollHeight > el.clientHeight)
      }
      const handleScroll = () => {
        const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1
        setAtBottom(isAtBottom)
      }
      checkOverflow()
      handleScroll()
      // ResizeObserver for container size changes
      const resizeObserver = new ResizeObserver(checkOverflow)
      resizeObserver.observe(el)
      // MutationObserver for row additions/removals
      const mutationObserver = new MutationObserver(() => {
        checkOverflow()
        handleScroll()
      })
      mutationObserver.observe(el, {
        childList: true,
        subtree: true,
      })
      el.addEventListener("scroll", handleScroll)
      return () => {
        resizeObserver.disconnect()
        mutationObserver.disconnect()
        el.removeEventListener("scroll", handleScroll)
      }
    }, [])

    useEffect(() => {
      if (typeof ref === "function") {
        ref(containerRef.current)
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current =
          containerRef.current
      }
    }, [ref])

    const scrollToBottom = () => {
      containerRef.current?.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }

    const scrollToTop = () => {
      containerRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    }

    return (
      <div className="relative">
        <div
          ref={containerRef}
          className="h-[calc(100vh-450px)] overflow-y-auto rounded-md border-0"
        >
          {children}
        </div>
        {isFetching && (
          <>
          <div className="absolute inset-0 z-10 flex rounded-lg items-center justify-center bg-white/50" />
          {/* <SpinnerIcon className="absolute inset-1/2 z-10 flex items-center justify-center animate-spin" /> */}
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={atBottom ? scrollToTop : scrollToBottom}
              className={`size-9 absolute bottom-0 right-0 z-10 rounded-full transition-opacity duration-300 bg-secondary ${isOverflowing ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              {atBottom ? <ArrowUp /> : <ArrowDown />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Scroll</p>
          </TooltipContent>
        </Tooltip>
      </div>
    )
  }
  ) 