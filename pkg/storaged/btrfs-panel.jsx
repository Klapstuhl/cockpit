import cockpit from "cockpit";

import {
    get_available_spaces, prepare_available_spaces
} from "./utils.js";
import { dialog_open, TextInput, SelectOne, SelectSpaces } from "./dialog.jsx";
const _ = cockpit.gettext;

export function create_btrfs_volume(client) {
    dialog_open({
        Title: _("Create Btrfs volume"),
        Fields :[
            TextInput("name", _("Name"), { }),
            SelectOne("data_level", _("Data RAID level"),
                      {
                          value: "raid0",
                          choices: [
                              {
                                  value: "raid0",
                                  title: _("RAID 0 (stripe)")
                              },
                              {
                                  value: "raid1",
                                  title: _("RAID 1 (mirror)")
                              },
                              {
                                  value: "raid10",
                                  title: _("RAID 10 (stripe of mirrors)")
                              },
                              {
                                  value: "single",
                                  title: _("Linear (non striped)")
                              }
                          ]
                      }),
            SelectOne("md_level", _("Metadata RAID level"),
                      {
                          value: "raid1",
                          choices: [
                              {
                                  value: "raid0",
                                  title: _("RAID 0 (stripe)")
                              },
                              {
                                  value: "raid1",
                                  title: _("RAID 1 (mirror)")
                              },
                              {
                                  value: "raid10",
                                  title: _("RAID 10 (stripe of mirrors)")
                              },
                              {
                                  value: "single",
                                  title: _("Linear (Non striped)")
                              }
                          ]
                      }),
            SelectSpaces("disks", _("Disks"),
                         {
                             empty_warning: _("No disks are available."),
                             validate: function (disks, vals) {
                                 var disks_needed = vals.data_level == "raid10" ? 4 : 2;
                                 if (disks.length < disks_needed)
                                     return cockpit.format(_("At least $0 disks are needed."),
                                                           disks_needed);
                             },
                             spaces: get_available_spaces(client)
                         })
        ],
        Action: {
            Title: _("Create"),
            action: function (vals) {
                return prepare_available_spaces(client, vals.disks).then(paths => {
                    return client.manager_btrfs.CreateVolume(paths, vals.name, vals.data_level, vals.md_level, { });
                });
            }
        }
    });
}