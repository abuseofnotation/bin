#!/bin/sh

cd ~/pr/x-notes

tmux new-session -d -s x
tmux send-keys -t x 'vim _permanent-confusion/' ENTER
tmux split-window -h
tmux send-keys -t x 'bundle exec jekyll serve' ENTER
tmux a
