import { type FC, type ReactNode } from "react"
import {
  ListItem,
  ListItemButton,
  type ListItemButtonProps,
  ListItemIcon,
  ListItemText,
} from "@mui/material"

export type ButtonItemProps = ListItemButtonProps & {
  isDrawerOpen: boolean
  icon: ReactNode
  text: string
}

const ButtonItem: FC<ButtonItemProps> = ({
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

export default ButtonItem
