import treeService from '../services/tree.js';
import searchNotesService from '../services/search_notes.js';
import noteautocompleteService from '../services/note_autocomplete.js';
import linkService from "../services/link.js";

const $dialog = $("#jump-to-note-dialog");
const $autoComplete = $("#jump-to-note-autocomplete");
const $showInFullTextButton = $("#show-in-full-text-button");
const $showRecentNotesButton = $dialog.find(".show-recent-notes-button");

$dialog.on("shown.bs.modal", e => $autoComplete.focus());

async function showDialog() {
    glob.activeDialog = $dialog;

    $autoComplete.val('');

    $dialog.modal();

    $autoComplete.autocomplete({
        appendTo: document.querySelector('body'),
        hint: false,
        autoselect: true,
        openOnFocus: true
    }, [
        {
            source: noteautocompleteService.autocompleteSource,
            displayKey: 'label',
            templates: {
                suggestion: function(suggestion) {
                    return suggestion.label;
                }
            }
        }
    ]).on('autocomplete:selected', function(event, suggestion, dataset) {
        console.log("selected: ", event, suggestion, dataset);
        return;

        if (ui.item.value === 'No results') {
            return false;
        }

        const notePath = linkService.getNotePathFromLabel(ui.item.value);

        treeService.activateNote(notePath);

        $dialog.modal('hide');
    });

    // await $autoComplete.autocomplete({
    //     source: noteautocompleteService.autocompleteSource,
    //     focus: event => event.preventDefault(),
    //     minLength: 0,
    //     autoFocus: true,
    //     select: function (event, ui) {
    //         if (ui.item.value === 'No results') {
    //             return false;
    //         }
    //
    //         const notePath = linkService.getNotePathFromLabel(ui.item.value);
    //
    //         treeService.activateNote(notePath);
    //
    //         $dialog.modal('hide');
    //     }
    // });

    //showRecentNotes();
}

function showInFullText(e) {
    // stop from propagating upwards (dangerous especially with ctrl+enter executable javascript notes)
    e.preventDefault();
    e.stopPropagation();

    const searchText = $autoComplete.val();

    searchNotesService.resetSearch();
    searchNotesService.showSearch();
    searchNotesService.doSearch(searchText);

    $dialog.modal('hide');
}

function showRecentNotes() {
    $autoComplete.autocomplete("search", "");
}

$showInFullTextButton.click(showInFullText);

$showRecentNotesButton.click(showRecentNotes);

$dialog.bind('keydown', 'ctrl+return', showInFullText);

export default {
    showDialog
};