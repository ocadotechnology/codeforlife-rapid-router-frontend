import {
  type CSSObject,
  Divider,
  Drawer,
  IconButton,
  type Theme,
} from "@mui/material"
import { ChevronLeft, Menu } from "@mui/icons-material"
import { type FC, type ReactNode } from "react"

const DRAWER_WIDTH = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

export interface MiniDrawerProps {
  open: boolean
  children: ReactNode
  onToggle: () => void
}

const MiniDrawer: FC<MiniDrawerProps> = props => {
  const { open, onToggle, children } = props
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={theme => {
        const base: CSSObject = {
          width: DRAWER_WIDTH,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          overflowX: "hidden",
        }
        if (open) {
          return {
            ...base,
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
          }
        } else {
          return {
            ...base,
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
          }
        }
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 10px",
        }}
      >
        <IconButton onClick={onToggle}>
          {open ? <ChevronLeft /> : <Menu />}
        </IconButton>
      </div>
      <Divider />
      {children}
    </Drawer>
  )
}

export default MiniDrawer
