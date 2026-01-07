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
  type Theme,
} from "@mui/material"
import { type FC, type ReactNode, useState } from "react"

import {
  PLAY_SPEEDS,
  type PanelLayout,
  type THREE_PANEL_LAYOUTS,
  type TWO_PANEL_LAYOUTS,
  nextGameCommand,
  restartGame,
  setPlaySpeed,
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

const MiniDrawerButtonItem: FC<
  BaseMiniDrawerItemProps &
    Omit<ListItemButtonProps, "children"> & {
      icon: ReactNode
      text: string
    }
> = ({ isDrawerOpen, icon, text, ...listItemButtonProps }) => (
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
    </ListItemButton>
  </ListItem>
)

type MiniDrawerPanelLayoutSelectProps = BaseMiniDrawerItemProps & {
  panelLayout?: PanelLayout
  panelLayoutOptions: typeof TWO_PANEL_LAYOUTS | typeof THREE_PANEL_LAYOUTS
  onPanelLayoutChange: (layout?: PanelLayout) => void
}

const MiniDrawerPanelLayoutSelect: FC<MiniDrawerPanelLayoutSelectProps> = ({
  isDrawerOpen,
  onPanelLayoutChange,
  panelLayoutOptions,
  panelLayout: selectedPanelLayout,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)
  const handleClose = () => setAnchorEl(null)

  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={event => {
          if (!open) setAnchorEl(event.currentTarget)
        }}
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
          id="layout-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{ list: { "aria-labelledby": "basic-button" } }}
        >
          {[undefined, ...panelLayoutOptions].map(panelLayout => {
            const value = panelLayout ?? "auto"
            return (
              <MenuItem
                onClick={() => {
                  onPanelLayoutChange(panelLayout)
                  handleClose()
                }}
                key={value}
                value={value}
                selected={panelLayout === selectedPanelLayout}
              >
                {value}
              </MenuItem>
            )
          })}
        </Menu>
      </ListItemButton>
    </ListItem>
  )
}

const MiniDrawerSelectSpeed: FC<BaseMiniDrawerItemProps> = ({
  isDrawerOpen,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const dispatch = useAppDispatch()
  const { playSpeed: currentPlaySpeed } = useSettings()

  const open = Boolean(anchorEl)
  const handleClose = () => setAnchorEl(null)

  return (
    <ListItem>
      <ListItemButton
        onClick={event => {
          if (!open) setAnchorEl(event.currentTarget)
        }}
        sx={{
          minHeight: 48,
          px: 0.75,
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
          <SpeedIcon />
        </ListItemIcon>
        <ListItemText
          primary="Speed"
          sx={{
            opacity: isDrawerOpen ? 1 : 0,
            "& span": { marginBottom: "auto" },
          }}
        />
      </ListItemButton>
      <Menu
        id="speed-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { "aria-labelledby": "basic-button" } }}
      >
        {PLAY_SPEEDS.map(speed => (
          <MenuItem
            onClick={() => {
              dispatch(setPlaySpeed(speed))
              handleClose()
            }}
            key={speed}
            value={speed}
            selected={speed === currentPlaySpeed}
          >
            {speed}
          </MenuItem>
        ))}
      </Menu>
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
    <List>{children}</List>
  </Drawer>
)

export type ControlsProps = Pick<
  MiniDrawerPanelLayoutSelectProps,
  "onPanelLayoutChange" | "panelLayout" | "panelLayoutOptions"
>

const Controls: FC<ControlsProps> = ({ ...panelLayoutSelectProps }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const dispatch = useAppDispatch()
  const blocklyWorkspaceContext = useBlocklyWorkspaceContext()
  const gameIsDefined = useGameIsDefined()
  const gameHasStarted = useGameHasStarted()
  const gameInPlay = useGameInPlay()
  const [playInterval, setPlayInterval, clearPlayInterval] = usePlayInterval()

  const baseItemProps: BaseMiniDrawerItemProps = { isDrawerOpen }

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
      <MiniDrawerSelectSpeed {...baseItemProps} />
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
      <MiniDrawerPanelLayoutSelect
        {...baseItemProps}
        {...panelLayoutSelectProps}
      />
    </MiniDrawer>
  )
}

export default Controls
