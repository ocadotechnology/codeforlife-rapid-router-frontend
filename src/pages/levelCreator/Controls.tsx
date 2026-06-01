import {
  Casino as CasinoIcon,
  Description as DescriptionIcon,
  DriveFolderUpload as DriveFolderUploadIcon,
  EditRoad as EditRoadIcon,
  ExitToApp as ExitToAppIcon,
  Extension as ExtensionIcon,
  Lightbulb as LightbulbIcon,
  Park as ParkIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  QuestionMark as QuestionMarkIcon,
  SaveOutlined as SaveOutlinedIcon,
} from "@mui/icons-material"
import { type FC, useState } from "react"
import { Divider } from "@mui/material"

import * as miniDrawers from "../../components/miniDrawers"

export interface ControlsProps {}

const Controls: FC<ControlsProps> = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [selected, setSelected] = useState("")

  const makeSelectableButtonItemProps = (
    id: string,
  ): Pick<
    miniDrawers.ButtonItemProps,
    "id" | "isDrawerOpen" | "selected" | "onClick"
  > => ({
    id,
    isDrawerOpen,
    selected: selected === id,
    onClick: () => setSelected(id),
  })

  return (
    <miniDrawers.MiniDrawer
      open={isDrawerOpen}
      onToggle={() => {
        setIsDrawerOpen(!isDrawerOpen)
      }}
    >
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("map")}
        text="Map"
        icon={<EditRoadIcon />}
      />
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("scenery")}
        text="Scenery"
        icon={<ParkIcon />}
      />
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("character")}
        text="Character"
        icon={<PersonIcon />}
      />
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("code")}
        text="Code"
        icon={<ExtensionIcon />}
      />
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("random")}
        text="Random"
        icon={<CasinoIcon />}
      />
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("description")}
        text="Description"
        icon={<DescriptionIcon />}
      />
      <miniDrawers.ButtonItem
        {...makeSelectableButtonItemProps("hint")}
        text="Hint"
        icon={<LightbulbIcon />}
      />
      <Divider />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Load"
        icon={<DriveFolderUploadIcon />}
      />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Save"
        icon={<SaveOutlinedIcon />}
      />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Share"
        icon={<PeopleIcon />}
      />
      <Divider />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Help"
        icon={<QuestionMarkIcon />}
      />
      <miniDrawers.ButtonItem
        isDrawerOpen={isDrawerOpen}
        text="Quit"
        icon={<ExitToAppIcon />}
      />
    </miniDrawers.MiniDrawer>
  )
}

export default Controls
