# core/text_processor.py
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
nltk.download('punkt', quiet=True)
nltk.download('averaged_perceptron_tagger', quiet=True)
from collections import Counter

nltk.download('punkt', quiet=True)

class TextProcessor:
    @staticmethod
    def word_count(text: str) -> int:
        return len(word_tokenize(text))

    @staticmethod
    def sentence_count(text: str) -> int:
        return len(sent_tokenize(text))

    @staticmethod
    def avg_sentence_length(text: str) -> float:
        sentences = sent_tokenize(text)
        if not sentences:
            return 0
        words = word_tokenize(text)
        return len(words) / len(sentences)

    @staticmethod
    def lexical_diversity(text: str) -> float:
        words = word_tokenize(text.lower())
        if not words:
            return 0
        return len(set(words)) / len(words)

    @staticmethod
    def pos_diversity(text: str) -> float:
        from nltk import pos_tag
        words = word_tokenize(text)
        if not words:
            return 0
        tags = [tag for word, tag in pos_tag(words)]
        return len(set(tags)) / len(tags)

    @staticmethod
    def syntactic_complexity(text: str) -> float:
        # For MVP: avg words per clause approximation using commas as simple clause separators
        sentences = sent_tokenize(text)
        if not sentences:
            return 0
        clause_counts = [sentence.count(',') + 1 for sentence in sentences]
        return sum(clause_counts) / len(clause_counts)
