import {
  AutoAwesomeMosaic as AutoAwesomeMosaicIcon,
  ChevronLeft as ChevronLeftIcon,
  Delete as DeleteIcon,
  Menu as MenuIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Redo as RedoIcon,
  Speed as SpeedIcon,
  Stop as StopIcon,
} from "@mui/icons-material"
import {
  type CSSObject,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  type ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  type MenuItemProps,
  type Theme,
} from "@mui/material"
import { type FC, type Key, type ReactNode, useState } from "react"
import type { PayloadAction } from "@reduxjs/toolkit"

import {
  PLAY_SPEEDS,
  THREE_PANEL_LAYOUTS,
  TWO_PANEL_LAYOUTS,
  nextGameCommand,
  restartGame,
  setPlaySpeed,
  setThreePanelLayout,
  setTwoPanelLayout,
} from "../../app/slices"
import {
  useAppDispatch,
  useBlocklyWorkspaceContext,
  useGameHasStarted,
  useGameInPlay,
  useGameIsDefined,
  usePlayInterval,
  useSettings,
} from "../../app/hooks"

interface BaseMiniDrawerItemProps {
  isDrawerOpen: boolean
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

type MiniDrawerButtonItemProps = BaseMiniDrawerItemProps &
  ListItemButtonProps & {
    icon: ReactNode
    text: string
  }

const MiniDrawerButtonItem: FC<MiniDrawerButtonItemProps> = ({
  isDrawerOpen,
  icon,
  text,
  children,
  ...listItemButtonProps
}) => (
  <ListItem disablePadding sx={{ display: "block" }}>
    <ListItemButton
      {...listItemButtonProps}
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
      {children}
    </ListItemButton>
  </ListItem>
)

type MiniDrawerButtonMenuItemProps<V extends MenuItemProps["value"]> = Omit<
  MiniDrawerButtonItemProps,
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

const MiniDrawerButtonMenuItem = <V extends MenuItemProps["value"]>({
  menuItems,
  selectedValue,
  ...miniDrawerButtonItemProps
}: MiniDrawerButtonMenuItemProps<V>) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClose = () => setAnchorEl(null)

  return (
    <MiniDrawerButtonItem
      onClick={event => {
        if (!open) setAnchorEl(event.currentTarget)
      }}
      {...miniDrawerButtonItemProps}
    >
      <Menu
        id="speed-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        {menuItems.map(({ value, title, key, onClick }) => (
          <MenuItem
            onClick={() => {
              onClick()
              handleClose()
            }}
            key={key}
            value={value}
            selected={selectedValue === value}
          >
            {title ?? key}
          </MenuItem>
        ))}
      </Menu>
    </MiniDrawerButtonItem>
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
    <List>{children}</List>
  </Drawer>
)

export type ControlsProps = { panelCount: number }

const Controls: FC<ControlsProps> = ({ panelCount }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const dispatch = useAppDispatch()
  const settings = useSettings()
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const gameIsDefined = useGameIsDefined()
  const gameHasStarted = useGameHasStarted()
  const gameInPlay = useGameInPlay()
  const [playInterval, setPlayInterval, clearPlayInterval] = usePlayInterval()

  const baseItemProps: BaseMiniDrawerItemProps = { isDrawerOpen }

  // Helper to map panel layout options to menu items.
  function mapPanelLayoutsToMenuItems<
    O extends readonly (string | undefined)[],
  >(
    panelLayoutOptions: O,
    setPanelLayout: (layout: O[number]) => PayloadAction<O[number]>,
  ): MiniDrawerButtonMenuItemProps<O[number]>["menuItems"] {
    return panelLayoutOptions.map(panelLayout => ({
      value: panelLayout,
      key: panelLayout ?? "auto",
      onClick: () => dispatch(setPanelLayout(panelLayout)),
    }))
  }

  return (
    <MiniDrawer
      open={isDrawerOpen}
      onToggle={() => {
        setIsDrawerOpen(!isDrawerOpen)
      }}
    >
      <MiniDrawerButtonItem
        {...baseItemProps}
        text="Clear"
        icon={<DeleteIcon />}
        onClick={() => {
          clearPlayInterval()
          if (blocklyWorkspaceContext?.ref.current) {
            blocklyWorkspaceContext.ref.current.clear()
          }
        }}
      />
      <MiniDrawerButtonItem
        {...baseItemProps}
        text={gameInPlay && playInterval ? "Pause" : "Play"}
        icon={gameInPlay && playInterval ? <PauseIcon /> : <PlayArrowIcon />}
        disabled={!gameIsDefined}
        onClick={() => {
          if (!clearPlayInterval()) setPlayInterval()
        }}
      />
      <MiniDrawerButtonMenuItem
        {...baseItemProps}
        icon={<SpeedIcon />}
        text="Speed"
        menuItems={PLAY_SPEEDS.map(playSpeed => ({
          value: playSpeed,
          key: playSpeed,
          onClick: () => dispatch(setPlaySpeed(playSpeed)),
        }))}
        selectedValue={settings.playSpeed}
      />
      <MiniDrawerButtonItem
        {...baseItemProps}
        text="Stop"
        icon={<StopIcon />}
        disabled={!gameHasStarted}
        onClick={() => {
          clearPlayInterval()
          dispatch(restartGame())
        }}
      />
      <MiniDrawerButtonItem
        {...baseItemProps}
        text="Step"
        icon={<RedoIcon />}
        disabled={!gameIsDefined}
        onClick={() => {
          clearPlayInterval()
          dispatch(nextGameCommand())
        }}
      />
      <MiniDrawerButtonMenuItem
        {...baseItemProps}
        text="Layout"
        icon={<AutoAwesomeMosaicIcon />}
        {...(panelCount === 2
          ? {
              menuItems: mapPanelLayoutsToMenuItems(
                TWO_PANEL_LAYOUTS,
                setTwoPanelLayout,
              ),
              selectedValue: settings.twoPanelLayout,
            }
          : {
              menuItems: mapPanelLayoutsToMenuItems(
                THREE_PANEL_LAYOUTS,
                setThreePanelLayout,
              ),
              selectedValue: settings.threePanelLayout,
            })}
      />
    </MiniDrawer>
  )
}

export default Controls
