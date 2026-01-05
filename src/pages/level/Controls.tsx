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
  type ListItemButtonProps,
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
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Redo as RedoIcon,
  Stop as StopIcon,
} from "@mui/icons-material"
import {
  type FC,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import {
  PLAY_SPEEDS,
  type PanelLayout,
  type THREE_PANEL_LAYOUTS,
  type TWO_PANEL_LAYOUTS,
  nextGameCommand,
  restartGame,
  setGameCommands,
  setPlaySpeed,
} from "../../app/slices"
import {
  useAppDispatch,
  useGameHasFinished,
  useGameHasStarted,
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
  onPanelLayoutChange: (panelLayout: PanelLayout) => void
}

const MiniDrawerPanelLayoutSelect: FC<MiniDrawerPanelLayoutSelectProps> = ({
  onPanelLayoutChange,
  panelLayoutOptions,
  panelLayout,
}) => (
  <ListItem>
    <FormControl fullWidth>
      <InputLabel id="layout-select-label">Layout</InputLabel>
      <Select
        labelId="layout-select-label"
        id="layout-select"
        value={panelLayout}
        label="Layout"
        onChange={e => onPanelLayoutChange(e.target.value)}
      >
        {panelLayoutOptions.map(panelLayoutOption => (
          <MenuItem key={panelLayoutOption} value={panelLayoutOption}>
            {panelLayoutOption}
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
  const { playSpeed } = useSettings()
  const gameHasStarted = useGameHasStarted()
  const gameHasFinished = useGameHasFinished()

  // Play interval management to dispatch nextGameCommand at correct speed.
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const setPlayInterval = useCallback(() => {
    playInterval.current = setInterval(() => {
      dispatch(nextGameCommand())
    }, 1000 / playSpeed)
  }, [dispatch, playSpeed])
  const clearPlayInterval = useCallback(() => {
    if (!playInterval.current) return false
    clearInterval(playInterval.current)
    playInterval.current = null
    return true
  }, [])

  useEffect(() => {
    if (gameHasFinished) clearPlayInterval()

    return () => {
      clearPlayInterval()
    }
  }, [gameHasFinished, clearPlayInterval])

  // Update interval if playSpeed changes.
  useEffect(() => {
    if (clearPlayInterval()) setPlayInterval()
  }, [clearPlayInterval, setPlayInterval, playSpeed])

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
          dispatch(setGameCommands([]))
        }}
      />
      <MiniDrawerButtonItem
        {...baseItemProps}
        text={playInterval.current ? "Pause" : "Play"}
        icon={playInterval.current ? <PauseIcon /> : <PlayArrowIcon />}
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
