import { path as _ } from "codeforlife/utils/router"

const paths = _("", {
  level: _("/level", {
    id: _("/:id"),
    creator: _("/creator"),
  }),
})

export default paths
