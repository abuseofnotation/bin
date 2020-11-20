 
" Attempt to determine the type of a file based on its name and possibly its
" contents. Use this to allow intelligent auto-indenting for each filetype,
" and for plugins that are filetype specific.
" filetype indent plugin on
 
" Enable syntax highlighting
syntax off
 
 
"
" Must have options {{{1
"
" These are highly recommended options.
 
" Vim with default settings does not allow easy switching between multiple files
" in the same editor window. Users can use multiple split windows or multiple
" tab pages to edit multiple files, but it is still best to enable an option to
" allow easier switching between files.
"
" One such option is the 'hidden' option, which allows you to re-use the same
" window and switch from an unsaved buffer without saving it first. Also allows
" you to keep an undo history for multiple files when re-using the same window
" in this way. Note that using persistent undo also lets you undo in multiple
" files even in the same window, but is less efficient and is actually designed
" for keeping undo history after closing Vim entirely. Vim will complain if you
" try to quit without saving, and swap files will keep you safe if your computer
" crashes.
" set hidden
 
" Note that not everyone likes working this way (with the hidden option).
" Alternatives include using tabs or split windows instead of re-using the same
" window as mentioned above, and/or either of the following options:
" set confirm
 set autowriteall
 
" Better command-line completion
set wildmenu
 
" Show partial commands in the last line of the screen
set showcmd
 
" Highlight searches (use <C-L> to temporarily turn off highlighting; see the
" mapping of <C-L> below)
set hlsearch
 
" Use case insensitive search, except when using capital letters
set ignorecase
set smartcase
 
" Allow backspacing over autoindent, line breaks and start of insert action
set backspace=indent,eol,start
 
" When opening a new line and no filetype-specific indenting is enabled, keep
" the same indent as the line you're currently on. Useful for READMEs, etc.
set autoindent
 
" Stop certain movements from always going to the first character of a line.
" While this behaviour deviates from that of Vi, it does what most users
" coming from other editors would expect.
set nostartofline
 
" Display the cursor position on the last line of the screen or in the status
" line of a window
set ruler
 
" Always display the status line, even if only one window is displayed
set laststatus=2
 
" Instead of failing a command because of unsaved changes, instead raise a
" dialogue asking if you wish to save changed files.
set confirm
 
" Use visual bell instead of beeping when doing something wrong
set visualbell
 
" And reset the terminal code for the visual bell. If visualbell is set, and
" this line is also included, vim will neither flash nor beep. If visualbell
" is unset, this does nothing.
set t_vb=
 
" Enable use of the mouse for all modes
set mouse=a
 
" Set the command window height to 2 lines, to avoid many cases of having to
" "press <Enter> to continue"
set cmdheight=2
 
" Display line numbers on the left
set number
 
" Quickly time out on keycodes, but never time out on mappings
set notimeout ttimeout ttimeoutlen=200

let mapleader = "\<Space>"
 

" Map Y to act like D and C, i.e. to yank until EOL, rather than act as yy,
" which is the default
map Y y$

 
"
" Indentation options 
"
 
" Indentation settings for using 4 spaces instead of tabs.
" Do not change 'tabstop' from its default value of 8 with this setup.
set shiftwidth=2
set softtabstop=2
set expandtab
 
" Indentation settings for using hard tabs for indent. Display tabs as
" four characters wide.
"set shiftwidth=4
"set tabstop=4
 

"
" writing
"

"display word count for files in dir
nmap <leader>w <esc>:!wc %:p:h/*<CR>

"spellcheck the current file
nmap <leader>s <esc>:!spellchecker -f %<CR>

"Search wikipedia for current word, using lynx
"nnoremap <leader>d yw:! lynx -dump https://en.wikipedia.org/w/index.php?search='<c-r>"'<CR>
nnoremap <leader>d yw:! lynx -dump https://en.wikipedia.org/wiki/<c-r>"<CR>

"
" node programming
"

"start current file in node js
nmap <leader>n <esc>:!node %<CR>

"insert debugger statement in JS file and launch test suite
nnoremap <leader>t :w<CR> :!killall -9 node;node debug --es_staging node_modules/nodeunit/bin/nodeunit <CR>

"eslint fix file
nnoremap <leader>l :!npx eslint --fix %<CR>


"
" modes
"


"jk goes to normal mode
inoremap jk <esc>

"Ctrl + j k h l goes to normal mode
inoremap <C-j> <esc> j
inoremap <C-k> <esc> k
inoremap <C-h> <esc> h
inoremap <C-l> <esc> l


"next match an put result in the middle
nnoremap <leader>n nzz

inoremap d^ v^d

"replace the current line by the contents of the zeroeth register (delete
"without erazing pasted content

nnoremap <leader>0 "0p

"disable keyboard navigation

nnoremap <up> <nop>
nnoremap <down> <nop>
nnoremap <left> <nop>
nnoremap <right> <nop>
inoremap <up> <nop>
inoremap <down> <nop>
inoremap <left> <nop>
inoremap <right> <nop>

"noremap jj <nop>
"noremap kk <nop>

"
" settings
"

"Search in all folders by default
set path+=**

"File browser
let g:netrw_banner=0
let g:liststyle=3

"Save files so watchers are triggered
:set backupcopy=yes


"set relativenumber
set undofile
set autoread

" Save files on losing focus
:au FocusLost * :wa

"Save files on buffer change
"autocmd TextChanged,TextChangedI <buffer> silent write


"this enables "visual" wrapping
set wrap

" j and k navigation do not skip wrapped lines
nnoremap j gj
nnoremap k gk

" this turns off physical line wrapping (ie: automatic insertion of newlines)
set textwidth=0 wrapmargin=0


