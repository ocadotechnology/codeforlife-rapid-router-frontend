import { type Key, useState } from "react"
import {
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  type MenuItemProps as MuiMenuItemProps,
} from "@mui/material"

import ButtonItem, { type ButtonItemProps } from "./ButtonItem"

export type MenuItemProps<V extends MuiMenuItemProps["value"]> = Omit<
  ButtonItemProps,
  "onClick" | "children"
> & {
  menuItems: Array<{
    value: V
    title?: string
    key: Key
    onClick: () => void
  }>
  selectedValue: V
}

const MenuItem = <V extends MuiMenuItemProps["value"]>({
  id,
  menuItems,
  selectedValue,
  ...buttonItemProps
}: MenuItemProps<V>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClose = () => setAnchorEl(null)

  return (
    <ButtonItem
      onClick={event => {
        if (!open) setAnchorEl(event.currentTarget)
      }}
      {...buttonItemProps}
    >
      <MuiMenu
        id={`${id}-menu`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        {menuItems.map(({ value, title, key, onClick }) => (
          <MuiMenuItem
            onClick={() => {
              onClick()
              handleClose()
            }}
            key={key}
            value={value}
            selected={selectedValue === value}
          >
            {title ?? key}
          </MuiMenuItem>
        ))}
      </MuiMenu>
    </ButtonItem>
  )
}

export default MenuItem
