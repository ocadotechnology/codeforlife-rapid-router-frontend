import {
  Agriculture as AgricultureIcon,
  BusAlert as BusIcon,
  Call as CallIcon,
  Cast as CastIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material"
import {
  type CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  type Theme,
} from "@mui/material"
import { type FC, type ReactNode, useState } from "react"

export interface ControlsProps {}

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

const MiniDrawer: FC<{
  open: boolean
  children: ReactNode
  onToggle: () => void
}> = ({ open, onToggle, children }) => (
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
    {children}
  </Drawer>
)

const MiniDrawerList: FC<{
  isDrawerOpen: boolean
  items: Array<{
    icon: ReactNode
    text: string
  }>
}> = ({ items, isDrawerOpen }) => {
  return (
    <List>
      {items.map(({ text, icon }) => (
        <ListItem key={text} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              px: 2.5,
              justifyContent: isDrawerOpen ? "initial" : "center",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                justifyContent: "center",
                mr: isDrawerOpen ? 1 : "auto",
              }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              sx={{
                opacity: isDrawerOpen ? 1 : 0,
                "& span": { marginBottom: "auto" },
              }}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

const Controls: FC<ControlsProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true)
  return (
    <MiniDrawer
      open={isDrawerOpen}
      onToggle={() => {
        setIsDrawerOpen(!isDrawerOpen)
      }}
    >
      <MiniDrawerList
        isDrawerOpen={isDrawerOpen}
        items={[
          {
            icon: <AgricultureIcon />,
            text: "Item 1",
          },
          {
            icon: <BusIcon />,
            text: "Item 2",
          },
          {
            icon: <CallIcon />,
            text: "Item 3",
          },
          {
            icon: <CastIcon />,
            text: "Item 4",
          },
        ]}
      />
    </MiniDrawer>
  )
}

export default Controls
