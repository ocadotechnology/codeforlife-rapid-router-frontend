import { path as _ } from "codeforlife/utils/router"

const paths = _("", {
  level: _("/level", {
    id: _("/:id", {
      1: _({ id: "1" }),
    }),
    creator: _("/creator"),
  }),
})

export default paths
