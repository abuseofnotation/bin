#!/usr/bin/env runhaskell
import Data.Char (toLower)
import Data.List (sortOn)
import Data.Map (Map, empty, insert, lookup, toList)

commonWords =
  [ "the",
    "of",
    "to",
    "and",
    "that",
    "a",
    "is",
    "are",
    "in",
    "I",
    "we",
    "you",
    "this",
    "it",
    "he",
    "she",
    "with",
    "on",
    "as",
    "was",
    "were",
    "would",
    "for",
    "but",
    "so",
    "do",
    "by",
    "be",
    "have",
    "can",
    "from",
    "which",
    "all",
    "not",
    "an",
    "they",
    "or",
    "if",
    "there",
    "what",
    "at",
    "will",
    "must",
    "may"
  ]

type Dict = Map String Integer

wordToDict :: String -> Dict -> Dict
wordToDict word dict = case Data.Map.lookup word dict of
  Nothing -> Data.Map.insert word 1 dict
  Just num -> Data.Map.insert word (num + 1) dict

buildDict :: String -> Dict
buildDict contents = (Prelude.foldr wordToDict empty (words contents))

formatDict :: Dict -> [(String, Integer)]
formatDict = reverse . sortOn snd . Data.Map.toList

erazeCommonWords :: [(String, Integer)] -> [(String, Integer)]
erazeCommonWords = filter (\(word, _) -> notElem word commonWords)

main :: IO ()
main = do
  contents <- getContents
  let wordCount = take 50 $ erazeCommonWords (formatDict (buildDict (map toLower contents)))
  putStrLn $ show wordCount