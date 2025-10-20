import * as pages from "codeforlife/components/page"
import * as yup from "yup"
import { Agriculture, BusAlert, Call, Cast } from "@mui/icons-material"
import { type FC, useState } from "react"
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { paths } from "../../routes"

import MiniDrawer from "../../components/MiniDrawer"
import { useParamsRequired } from "codeforlife/hooks"

export interface LevelProps {}

interface LevelState {
  panels: 2 | 3
}

const MOCK_DRAWER_ITEMS = [
  {
    icon: <Agriculture />,
    text: "Item 1",
  },
  {
    icon: <BusAlert />,
    text: "Item 2",
  },
  {
    icon: <Call />,
    text: "Item 3",
  },
  {
    icon: <Cast />,
    text: "Item 4",
  },
]

const Level: FC<LevelProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [level] = useState<LevelState>({ panels: 2 })
  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }
  return useParamsRequired({
    shape: { id: yup.number().required().min(1) },
    children: () => (
      <pages.Page>
        <MiniDrawer open={isDrawerOpen} onToggle={handleToggleDrawer}>
          <List>
            {MOCK_DRAWER_ITEMS.map(({ text, icon }) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={[
                    {
                      minHeight: 48,
                      px: 2.5,
                    },
                    isDrawerOpen
                      ? {
                          justifyContent: "initial",
                        }
                      : {
                          justifyContent: "center",
                        },
                  ]}
                >
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      isDrawerOpen
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={[
                      isDrawerOpen
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
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
        </MiniDrawer>
        <pages.Section>
          <Typography>Level state: {JSON.stringify(level)}</Typography>
        </pages.Section>
      </pages.Page>
    ),
    onValidationSuccess: params => {
      console.log(`Level ID from URL: ${params.id}`)
      // TODO: call API
    },
    onValidationError: navigate => {
      // Redirect to home with error message
      navigate(paths._, {
        state: {
          notifications: [
            { props: { error: true, children: "Invalid level ID" } },
          ],
        },
      })
    },
  })
}

export default Level
