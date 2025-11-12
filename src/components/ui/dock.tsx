"use client"

import * as React from "react"
import { useState, useRef } from "react"
import ReactDOM from "react-dom"

import { cn } from "@/lib/utils"

interface DockProps {
  className?: string
  items: DockIconProps[]
  maxAdditionalSize?: number
  iconSize?: number
}

interface DockIconProps {
  className?: string
  src?: string
  href: string
  name: string
  outcome?: string
  handleIconHover?: (e: React.MouseEvent<HTMLLIElement>) => void
  children?: React.ReactNode
  iconSize?: number
  isActive?: boolean
  onTap?: () => void
}

type ScaleValueParams = [number, number]

// New Tooltip component to be rendered in a portal
function Tooltip({
  name,
  outcome,
  top,
  left,
}: {
  name: string
  outcome?: string
  top: number
  left: number
}) {
  if (typeof document === "undefined") {
    return null
  }

  return ReactDOM.createPortal(
    <div
      style={{ top: `${top}px`, left: `${left}px` }}
      className="fixed -translate-x-1/2 -translate-y-full rounded-md border border-gray-100 bg-gradient-to-t from-neutral-100 to-white p-2 px-3 text-center shadow-lg z-50 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-800"
    >
      <p className="font-bold text-sm text-black dark:text-white">{name}</p>
      {outcome && <p className="text-xs text-gray-500 dark:text-gray-400">{outcome}</p>}
    </div>,
    document.body
  )
}

export const scaleValue = function (
  value: number,
  from: ScaleValueParams,
  to: ScaleValueParams
): number {
  const scale = (to[1] - to[0]) / (from[1] - from[0])
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return Math.floor(capped * scale + to[0])
}

export function DockIcon({
  className,
  src,
  href,
  name,
  outcome,
  handleIconHover,
  children,
  iconSize,
  isActive,
  onTap,
}: DockIconProps) {
  const ref = useRef<HTMLLIElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null)

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      })
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTooltipPosition(null)
  }

  // On mobile, we want to show the tooltip on tap (isActive), but we need to calculate its position.
  // We do this when isActive becomes true.
  React.useEffect(() => {
    if (isActive && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      })
    }
  }, [isActive])

  const showTooltip = isHovered || isActive

  return (
    <>
      {showTooltip && tooltipPosition && (
        <Tooltip name={name} outcome={outcome} top={tooltipPosition.top} left={tooltipPosition.left} />
      )}
      <li
        ref={ref}
        onClick={onTap}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          {
            transition:
              "width, height, margin-top, cubic-bezier(0.25, 1, 0.5, 1) 150ms",
            "--icon-size": `${iconSize}px`,
          } as React.CSSProperties
        }
        onMouseMove={handleIconHover}
        className={cn(
          "icon group/li flex h-[var(--icon-size)] w-[var(--icon-size)] cursor-pointer items-center justify-center px-[calc(var(--icon-size)*0.075)] hover:-mt-[calc(var(--icon-size)/2)] hover:h-[calc(var(--icon-size)*1.5)] hover:w-[calc(var(--icon-size)*1.5)] [&_img]:object-contain",
          className
        )}
      >
        <a
          href={href}
          className="group/a relative aspect-square w-full rounded-[10px] border border-gray-100 bg-gradient-to-t from-neutral-100 to-white p-1.5 shadow-[rgba(0,_0,_0,_0.05)_0px_1px_0px_inset] after:absolute after:inset-0 after:rounded-[inherit] after:shadow-md after:shadow-zinc-800/10 dark:border-zinc-900 dark:from-zinc-900 dark:to-zinc-800 dark:shadow-[rgba(255,_255,_255,_0.3)_0px_1px_0px_inset]"
        >
          {src ? (
            <img
              src={src}
              alt={name}
              className="h-full w-full rounded-[inherit]"
            />
          ) : (
            children
          )}
        </a>
      </li>
    </>
  )
}

export function Dock({
  className,
  items,
  maxAdditionalSize = 5,
  iconSize = 68,
}: DockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)
  const [activeIcon, setActiveIcon] = useState<number | null>(null)

  const handleIconHover = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!dockRef.current) return
    const mousePos = e.clientX
    const iconPosLeft = e.currentTarget.getBoundingClientRect().left
    const iconWidth = e.currentTarget.getBoundingClientRect().width

    const cursorDistance = (mousePos - iconPosLeft) / iconWidth
    const offsetPixels = scaleValue(
      cursorDistance,
      [0, 1],
      [maxAdditionalSize * -1, maxAdditionalSize]
    )

    dockRef.current.style.setProperty(
      "--dock-offset-left",
      `${offsetPixels * -1}px`
    )

    dockRef.current.style.setProperty(
      "--dock-offset-right",
      `${offsetPixels}px`
    )
  }

  return (
    <nav ref={dockRef} role="navigation" aria-label="Main Dock">
      <ul
        className={cn(
          "flex items-center rounded-xl border border-gray-100 bg-gradient-to-t from-neutral-50 to-white p-1 dark:border-zinc-900 dark:from-zinc-950 dark:to-zinc-900",
          className
        )}
      >
        {items.map((item, index) => (
          <DockIcon
            key={index}
            {...item}
            isActive={index === activeIcon}
            onTap={() => {
              setActiveIcon(index === activeIcon ? null : index)
            }}
            handleIconHover={handleIconHover}
            iconSize={iconSize}
          />
        ))}
      </ul>
    </nav>
  )
}
