# Translation keys: naming conventions and organizing[^1]

## 1\. Develop a proper naming scheme

Coming up with a proper naming scheme is very important because it will help get things organized. After all, you don’t want to end up in a situation where some devs are using a flat naming scheme with random key names, while others rely heavily on nesting. Therefore, do spend some time on establishing basic guidelines and ensure that every team member understands and supports them.

For example, decide on whether the keys should be named in `CamelCase` or `snake_case`. Also, think of a way to differentiate similar keys that have different contexts. You could add special prefixes, postfixes, or place such keys under different namespaces (see below). Plus, remember to decide on what to do with duplicates. Finally, don’t forget that the key names should not be overly complex or meaningless (also below).

## 2\. Give translation keys meaningful names

It is important to use sensible key names at all times. The key name should succinctly sum up its purpose and give a general idea of what value it holds. Basically, it’s very similar to properly naming your variables within the code. For example, names like `welcoming_message` or `choose_locale` are pretty self-explanatory. `heading` and `dropdown`, in turn, are not very helpful: when you see these two keys in your code, it’s really hard to understand what values they actually hold and what their purpose is.

On the other hand, don’t become overly specific: the key name should not strictly follow the value it holds. Also, do not use translation key values as their names. Ultimately, if the value drastically changes you may need to update the key name accordingly to keep things in sync. The result of this means finding all usages of the key and updating it as well, which is tedious and can lead to errors.

## 3\. Group translation keys into namespaces

If the technology permits, try to nest your translation keys under separate namespaces. These namespaces can, for example, be named after different pages of your site or portions of the screen. Separating keys into namespaces provides the following benefits:

-   It helps avoid name clashes. For instance, multiple pages may contain keys called `save` with different contexts. With a flat naming scheme, you will need to introduce special prefixes or suffixes to differentiate between those keys. With namespaces, this is not a problem at all: e.g., the keys can be named `order.save` and `profile.save`.
-   Properly structuring and organizing keys means you’re unlikely to get lost in the sea of unrelated and ungrouped translations. Nesting adds visual separation of the keys which is quite useful.

```json
{
  "order": {
    "checkout": "Proceed to checkout",
    "continue_shopping": "Return to the store and continue shopping",
    "discard": "Remove all items from the card and discard the order",
    "save": "Save the order as draft"
  },
  "profile": {
    "save": "Save profile changes",
    "undo": "Undo all recent profile changes",
    "edit_password": "Edit your password"
  }
}
```

On the other hand, don’t overuse namespaces and don’t provide overly complex structures. Normally, having 2-3 levels of nesting is enough in most cases. Nesting your keys too deep usually means that maintaining them later will become more complicated.

## 4\. Take advantage of a global namespace

You most likely have certain keys that are being used in different parts of your application. Some common examples are keys like “Profile”, “Save”, “Next”, etc. You may group such keys under a special namespace called `global` (or `general`) and use them throughout the app. This way you won’t need to create dozens of duplicate entries that will be hard to deal with later.

```json
{
  "global": {
    "ok": "Okay",
    "cancel": "Cancel",
    "next": "Next",
    "previous": "Previous"
  }
}
```

## 5\. Avoid translation key duplication

In many cases, developers tend to get rid of duplicated keys and merge them to a single entry. After all, you probably don’t want to end up with ten occurrences of the `save` key, right? Additionally, having fewer keys means less work to be done when translating them. In the simplest case, it can be done manually by finding all duplicates and replacing them with a single key. Some technologies may provide special scripts to solve this task. This problem can also be avoided by introducing a global namespace (see above).

Nevertheless, having a single “god” key that is used in all areas of your app is not always beneficial. Suppose you have a `confirm` key with the English value “Confirm”. You utilize this key in different areas of your app, and don’t have any problems with that. But then your designer asks you to replace “Confirm” with “OK” on the registration page because it just feels more concise. This means that you’ll still need to create a new translation key with a different name and a different translation. Another problem is that certain words or phrases may need to be translated differently depending on their usage and context. Therefore, translations for such “god” keys may look awkward in certain cases.

## 6\. Avoid concatenating translations

Sometimes developers favor taking different translations and concatenating them, thus creating new strings of text. For example, imagine there are two keys with the English translations “agree” and “proceed”. There’s also a button that should say “agree and proceed” (the text can be capitalized with built-in functions later). To avoid duplication, you could fetch those keys and combine their values in the following way `t('agree') + ' ' + t('proceed')`. Would that work? Certainly. Is this a good idea? Not quite. Remember that certain languages may have different word orders, and simply combining words will produce a sentence that makes no sense or that sounds awkward.

For instance, the word “Agree” may be translated into Russian as “соглашаюсь”, whereas “Proceed” is “продолжить”. However, combining those two words produces a rather strange sentence “соглашаюсь и продолжить”. Therefore, it is advisable to create a separate key each time you need to present a new translation value.

## 7\. Remove unused translation keys

Keep your translation files tidy and don’t leave any orphan keys that are no longer being used. If you are removing all occurrences of a key from your codebase, don’t leave it hanging in the translation files. In the end, keeping a clean codebase is always a good idea. Certain technologies may present special scripts to help find orphaned keys.

## 8\. Place translations into separate files and folders

The larger the app becomes, the harder it will be to maintain. The same concept applies to your translations. Having a single file with all translations for all supported languages is not the best approach because you’ll be overwhelmed by having so many keys in one place. What you can do about this:

-   Store translations for different languages in separate files.
-   Separate translation files by folder. For example, you may have folders with English, French, and German translations.
-   Divide up translations further based on their scope. For instance, you could create files with translations related to your blog, forum, and static pages like your home and about pages.


[^1]: https://lokalise.com/blog/translation-keys-naming-and-organizing/
