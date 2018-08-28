# SpinText
A tool for generating text from word chains(optionally nested). Source is a refactored version of the TypeScript project found in [this repo](https://github.com/hallojoe/HalloJoe.Spin).

## Install

`npm intall spintext --save`

## Use
    var text = "{This is|It's} {Spin|Spin-text|Spin text}. {Enjoy!| You love it!}"
    var engine = new SpinText.Engine(text);
    
    console.log('Minimum number of words output will contain ', engine.countMinWords());
    console.log('Maximum number of words output will contain ', engine.countMaxWords());
    console.log('Possible number of variants output can be ', engine.countVariants());

    console.log('Text result', engine.toString());

Try Above example on [plnkr](http://plnkr.co/edit/C4PZ9vhH6olH7KpN95Ev?p=preview)

## Try
A demo can be found [here](https://hallojoe.github.io/SpinText/)
