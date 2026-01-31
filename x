#!/bin/sh

if tmux has-session -t x 2>/dev/null; then
  tmux attach-session -t x
  exit
fi

cd ~/pr/mind-against-the-machine
tmux new-session -d -s x
tmux send-keys -t x 'vim _dont-fear/*' ENTER
tmux split-window -h
tmux send-keys -t x 'bundle exec jekyll serve --port 5000' ENTER
tmux a
