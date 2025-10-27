import {
  Agriculture as AgricultureIcon,
  BusAlert as BusIcon,
  Call as CallIcon,
  Cast as CastIcon,
} from "@mui/icons-material"
import { type FC, type ReactNode, useState } from "react"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material"

import { MiniDrawer } from "../../components"

export interface MiniDrawerItem {
  icon: ReactNode
  text: string
}

export interface LevelMiniDrawerProps {}

export interface MiniDrawerListProps {
  isDrawerOpen: boolean
  items: MiniDrawerItem[]
}

const MOCK_DRAWER_ITEMS: MiniDrawerItem[] = [
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
]

const MiniDrawerList: FC<MiniDrawerListProps> = ({ items, isDrawerOpen }) => {
  return (
    <List>
      {items.map(({ text, icon }) => (
        <ListItem key={text} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={[
              {
                minHeight: 48,
                px: 2.5,
                justifyContent: isDrawerOpen ? "initial" : "center",
              },
            ]}
          >
            <ListItemIcon
              sx={theme => ({
                minWidth: 0,
                justifyContent: "center",
                mr: isDrawerOpen ? theme.spacing(1) : "auto",
              })}
            >
              {icon}
            </ListItemIcon>
            <ListItemText
              primary={text}
              sx={[
                {
                  opacity: isDrawerOpen ? 1 : 0,
                },
                {
                  "& span": {
                    marginBottom: "auto",
                  },
                },
              ]}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}

const LevelMiniDrawer: FC<LevelMiniDrawerProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true)
  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }
  return (
    <MiniDrawer open={isDrawerOpen} onToggle={handleToggleDrawer}>
      <MiniDrawerList isDrawerOpen={isDrawerOpen} items={MOCK_DRAWER_ITEMS} />
    </MiniDrawer>
  )
}

export default LevelMiniDrawer
