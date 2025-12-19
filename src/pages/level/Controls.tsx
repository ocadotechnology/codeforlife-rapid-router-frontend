import {
  Agriculture as AgricultureIcon,
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
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
  Menu,
  MenuItem,
  type Theme,
} from "@mui/material"
import { type FC, type ReactNode, useState } from "react"
import {
  type PanelLayout,
  type THREE_PANEL_LAYOUTS,
  type TWO_PANEL_LAYOUTS,
} from "../../app/slices"

interface BaseMiniDrawerItemProps {
  isDrawerOpen: boolean
}
export interface ControlsProps {
  layout: PanelLayout
  layoutOptions: typeof TWO_PANEL_LAYOUTS | typeof THREE_PANEL_LAYOUTS
  onLayoutChange: (layout: PanelLayout) => void
}

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

const MiniDrawerButtonItem: FC<
  BaseMiniDrawerItemProps & {
    icon: ReactNode
    text: string
  }
> = ({ isDrawerOpen, icon, text }) => (
  <ListItem disablePadding sx={{ display: "block" }}>
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
)

const MiniDrawerSelectLayout: FC<
  BaseMiniDrawerItemProps & {
    layout: PanelLayout
    layoutOptions: typeof TWO_PANEL_LAYOUTS | typeof THREE_PANEL_LAYOUTS
    onLayoutChange: (layout: PanelLayout) => void
  }
> = ({ isDrawerOpen, onLayoutChange, layoutOptions }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!open) setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleClick}
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
          <AutoAwesomeMosaicIcon />
        </ListItemIcon>
        {/* TODO: i18n */}
        <ListItemText
          primary="Layout"
          sx={{
            opacity: isDrawerOpen ? 1 : 0,
            "& span": { marginBottom: "auto" },
          }}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
        >
          {layoutOptions.map(layout => (
            <MenuItem
              onClick={() => {
                onLayoutChange(layout)
                handleClose()
              }}
              key={layout}
              value={layout}
            >
              {layout}
            </MenuItem>
          ))}
        </Menu>
      </ListItemButton>
    </ListItem>
  )
}

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

const Controls: FC<ControlsProps> = ({
  layoutOptions,
  layout,
  onLayoutChange,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true)
  const baseItemProps: BaseMiniDrawerItemProps = { isDrawerOpen }

  return (
    <MiniDrawer
      open={isDrawerOpen}
      onToggle={() => {
        setIsDrawerOpen(!isDrawerOpen)
      }}
    >
      <List>
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Item 1"
          icon={<AgricultureIcon />}
        />
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Item 2"
          icon={<BusIcon />}
        />
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Item 3"
          icon={<CallIcon />}
        />
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Item 4"
          icon={<CastIcon />}
        />
        <MiniDrawerSelectLayout
          {...baseItemProps}
          layout={layout}
          layoutOptions={layoutOptions}
          onLayoutChange={onLayoutChange}
        />
      </List>
    </MiniDrawer>
  )
}

export default Controls
