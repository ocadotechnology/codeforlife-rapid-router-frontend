import {
  type CSSObject,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  type Theme,
} from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  PlayArrow as PlayArrowIcon,
  Redo as RedoIcon,
  Stop as StopIcon,
} from "@mui/icons-material"
import { type FC, type ReactNode, useState } from "react"

import {
  PLAY_SPEEDS,
  type PanelLayout,
  type THREE_PANEL_LAYOUTS,
  type TWO_PANEL_LAYOUTS,
  setPlaySpeed,
} from "../../app/slices"
import { useAppDispatch, useSettings } from "../../app/hooks"
import { useLevelContext } from "./LevelContext"

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
    onClick: () => void
  }
> = ({ isDrawerOpen, onClick, icon, text }) => (
  <ListItem disablePadding sx={{ display: "block" }}>
    <ListItemButton
      onClick={onClick}
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
> = ({ onLayoutChange, layoutOptions, layout }) => (
  <ListItem>
    <FormControl fullWidth>
      <InputLabel id="layout-select-label">Layout</InputLabel>
      <Select
        labelId="layout-select-label"
        id="layout-select"
        value={layout}
        label="Layout"
        onChange={e => onLayoutChange(e.target.value)}
      >
        {layoutOptions.map(layout => (
          <MenuItem key={layout} value={layout}>
            {layout}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </ListItem>
)

const MiniDrawerSelectSpeed: FC<BaseMiniDrawerItemProps> = () => {
  const dispatch = useAppDispatch()
  const { playSpeed } = useSettings()

  return (
    <ListItem>
      <FormControl fullWidth>
        <InputLabel id="speed-select-label">Speed</InputLabel>
        <Select
          labelId="speed-select-label"
          id="speed-select"
          value={playSpeed}
          label="Speed"
          onChange={e => dispatch(setPlaySpeed(e.target.value))}
        >
          {PLAY_SPEEDS.map(speed => (
            <MenuItem key={speed} value={speed}>
              {speed}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const { blocklyWorkspaceRef } = useLevelContext()!

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
          text="Clear"
          icon={<DeleteIcon />}
          onClick={() => {
            console.log("Clear clicked")
          }}
        />
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Play"
          icon={<PlayArrowIcon />}
          onClick={() => {
            if (blocklyWorkspaceRef.current) blocklyWorkspaceRef.current.play()
          }}
        />
        <MiniDrawerSelectSpeed {...baseItemProps} />
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Stop"
          icon={<StopIcon />}
          onClick={() => {
            if (blocklyWorkspaceRef.current) blocklyWorkspaceRef.current.stop()
          }}
        />
        <MiniDrawerButtonItem
          {...baseItemProps}
          text="Step"
          icon={<RedoIcon />}
          onClick={() => {
            if (blocklyWorkspaceRef.current) blocklyWorkspaceRef.current.step()
          }}
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
