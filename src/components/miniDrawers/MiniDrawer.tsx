import {
  type CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import { type FC, type ReactNode } from "react"

export interface MiniDrawerProps {
  open: boolean
  children: ReactNode
  onToggle: () => void
  onOpened?: () => void
  onClosed?: () => void
  width?: number
}

const MiniDrawer: FC<MiniDrawerProps> = ({
  open,
  onToggle,
  onOpened,
  onClosed,
  children,
  width = 240,
}) => (
  <Drawer
    variant="permanent"
    open={open}
    slotProps={{
      paper: { onTransitionEnd: () => (open ? onOpened : onClosed)?.() },
    }}
    sx={theme => {
      const base: CSSObject = {
        width,
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        overflowX: "hidden",
      }

      const opened: CSSObject = {
        width,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }

      const closed: CSSObject = {
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up("sm")]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
        },
        overflowX: "hidden",
      }

      return open
        ? { ...base, ...opened, "& .MuiDrawer-paper": opened }
        : { ...base, ...closed, "& .MuiDrawer-paper": closed }
    }}
  >
    <IconButton
      sx={theme => ({
        my: 0,
        ml: "auto",
        mr: open ? 0 : 1,
        [theme.breakpoints.up("sm")]: {
          mr: open ? 0 : 1.5,
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
    <List>{children}</List>
  </Drawer>
)

export default MiniDrawer
