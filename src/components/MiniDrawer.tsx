import {
  type CSSObject,
  Divider,
  Drawer,
  IconButton,
  type Theme,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { type FC, type ReactNode } from "react"

const DRAWER_WIDTH = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
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

const MiniDrawer: FC<MiniDrawerProps> = ({ open, onToggle, children }) => (
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
      return open
        ? {
            ...base,
            ...openedMixin(theme),
            "& .MuiDrawer-paper": openedMixin(theme),
          }
        : {
            ...base,
            ...closedMixin(theme),
            "& .MuiDrawer-paper": closedMixin(theme),
          }
    }}
  >
    <IconButton
      sx={theme => ({
        my: 0,
        ml: "auto",
        mr: open ? 0 : theme.spacing(1),
        [theme.breakpoints.up("sm")]: {
          mr: open ? 0 : theme.spacing(1.5),
        },
        transition: theme.transitions.create("margin-right", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      })}
      onClick={onToggle}
    >
      {open ? <ChevronLeftIcon /> : <MenuIcon />}
    </IconButton>

    <Divider />
    {children}
  </Drawer>
)

export default MiniDrawer
