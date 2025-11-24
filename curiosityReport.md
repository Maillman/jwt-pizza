# Curiosity Report: Semantic Versioning
## Versioning
In production software, versioning is a way to identify what code was used when features were introduced, bugs were discovered, or a failure occurred. Version IDs allow us to reference an exact copy of the code for that version. There are several different ways we can represent the version we released with the version ID.
## Different Versioning Schemes
| **Type**              | Incremental                                                   | Semantic                                             | Date                                                              | Referential                              |
| --------------------- | ------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| **Short Description** | Increments a number every time a production package is built. | Uses an ID that has a syntax of `Major.Minor.Patch`. | Uses an ID that represents when the production package was built. | Uses an identifier for another system.   |
| **Example**           | v12                                                           | v1.21.5                                              | v2052.0212.121011                                                 | 6b1747df724dacdad46e2a6afb68b457ada1e890 |
## Semantic Versioning
### Why Use It?
It seems that most software uses some form of semantic versioning. In fact, I was trying to search for examples of real software that uses incremental versioning and referential versioning, but I couldn't find any after a couple google searches (at least those identified primarily by incremental or referential versioning). I do know of a couple software that uses CalVer (date versioning), like [**Ubuntu Linux**](https://en.wikipedia.org/wiki/Ubuntu_version_history) and [**youtube-dl**](https://github.com/ytdl-org/youtube-dl).

But most versioning is semantic versioning and it seems to be the industry standard.

It's mainly used ["to communicate your intentions to the users of your software"](https://semver.org/#:~:text=By%20giving%20a%20name%20and%20clear%20definition%20to%20the%20above%20ideas%2C%20it%20becomes%20easy%20to%20communicate%20your%20intentions%20to%20the%20users%20of%20your%20software.). Any users of your software can know that they can generally safely upgrade to newer versions if the `minor` or `patch` number changes, but they should pay closer attention if the `major` number and they want to use that version. You can ["let Semantic Versioning provide you with a sane way to release and upgrade packages without having to roll new versions of dependent packages, saving you time and hassle"](https://semver.org/#:~:text=let%20Semantic%20Versioning%20provide%20you%20with%20a%20sane%20way%20to%20release%20and%20upgrade%20packages%20without%20having%20to%20roll%20new%20versions%20of%20dependent%20packages%2C%20saving%20you%20time%20and%20hassle.). It's effectively trying to solve what https://semver.org/ calls “dependency hell.”

### The `Major.Minor.Patch`
Something that confusing to me when I first learned about semantic versioning was understanding what the different numbers really meant. I mean, the patch number is pretty self-explanatory, you increment that number for "patches" or bug-fixes. But what is the difference between the `major` and the `minor` number?

According to https://semver.org/, the `major` is incremented "when you make incompatible API changes", and the `minor` is incremented "when you add functionality in a backward compatible manner" (https://semver.org/#summary). But that still left me initially confused, because what constitutes as a backward compatible change and a non-backward compatible change?

I think one important thing that should be paid attention to is the [Specification on Semantic Versioning](https://docs.google.com/document/d/12ZrcsQAfVirCuCwzI0TKX_tSPyBOjqB9vDE-sx1n_S0/edit). The specification says that "Software using Semantic Versioning MUST declare a public API. This API could be declared in the code itself or exist strictly in documentation. However it is done, it SHOULD be precise and comprehensive" (https://semver.org/#spec-item-1).

So any software that is using Semantic Versioning is primarily created with the intent for it to be used by other software. That still doesn't really answer the question on what is a backward compatible change and what isn't though.
## The `Major` Against the `Minor`
Looking up the question, I found that "An incompatible API change means that something in the interface has changed in a way that would break the interactions with clients. It could mean adding required arguments to a method or endpoint, changing the types and structures of data returned, or removing a method. Any client who uses a method with these incompatible changes needs to update their code to handle the new interface appropriately". As for minor changes, you can add a new method or endpoint, providing new functionality to clients without changing any existing interactions (https://softwareengineering.stackexchange.com/questions/445184/can-you-explain-what-major-and-minor-version-is/445187#445187).

One other interesting thing I found from the answer found above: "Marking a method as deprecated also doesn't change any existing interactions and can provide information to people calling the API that a future major version will cause significant changes to how they interact with the API. In a minor update, clients are not required to take immediate action, but may choose to take steps to use the new or modified functionality."
## Do Video Games use Semantic Versioning?
One other thing I've realized is that there are several video games that seem to use semantic versioning. For example (as of writing), [Minecraft's latest version](https://feedback.minecraft.net/hc/en-us/sections/360001186971-Release-Changelogs) for Java edition is 1.21.10 and for Bedrock edition is 1.21.121, [Pokémon Go](https://apps.apple.com/us/app/pok%C3%A9mon-go/id1094591345) is on version 0.385.2, and [Palworld](https://store.steampowered.com/news/app/1623730?updates=true&emclan=103582791470193170&emgid=578275695267938324) is on version v0.6.9.

But these video games clearly aren't libraries and they don't declare a public API, thereby breaking the specification outlined in http://semver.org. So what's going on here?

Well, it turns out that someone asked a somewhat similar question on Reddit a few years ago: https://www.reddit.com/r/gamedev/comments/185rnkx/i_dont_understand_semantic_game_versioning_how_do/. The top reply says, "Semantic versioning only makes sense for libraries and functionality that other projects externally from your own project depends on. It does not make sense for end user products... Semantic versioning about _conveying what has changed to users of your_ _**library**_ _in a release_, it's not a "feature counter" or "commit counter"... You do whatever you feel like with versioning in the end user product, what communicates to the end user, and what **is marketable**."

Ultimately, it seems that video game developers choose the type of versioning that makes the most sense to them and some choose to use semantic versioning as it is the most closely aligned versioning scheme to what they want to communicate to the end user and some don't. In fact, the semantic versioning scheme used by the games listed above are rarely ever used by the end users. There is often a more well-known name the developers choose for the update that gets released. For example, [Minecraft version 1.21.9 for Java Edition](https://www.minecraft.net/en-us/article/minecraft-java-edition-1-21-9) is more widely known as "The Copper Age", and [Palworld v0.6.0](https://store.steampowered.com/news/app/1623730/view/518590951147438122) is more widely known as "Tides of Terraria".

So, while some video game developers may use semantic versioning to convey the size or change of their game. Most generally don't convey to their player-base using this type of versioning and market using a name for their update.
## Additional Details
There are a couple of other interesting details regarding semantic versioning:
- A software at `Major` version zero (0.y.z) should not be considered stable and "anything MAY change at any time", i.e. there should always be considered breaking non-backward compatible changes, (https://semver.org/#spec-item-4).
- "A pre-release version MAY be denoted by appending a hyphen and a series of dot separated identifiers immediately following the patch version... A pre-release version indicates that the version is unstable and might not satisfy the intended compatibility requirements as denoted by its associated normal version" (https://semver.org/#spec-item-9).
- "Build metadata MAY be denoted by appending a plus sign and a series of dot separated identifiers immediately following the patch or pre-release version... Build metadata MUST be ignored when determining version precedence" (https://semver.org/#spec-item-10).
	- Note: Build metadata is data that provides information about the build of the software using details like the build date, commit ID, user, and environment (https://semver.org/#is-v123-a-semantic-version).
- "v1.2.3" is not a semantic version, as the semantic version should be "1.2.3", but prefixing a semantic version with a "v" is a common way to indicate it is a version number.
Using the additional details listed above, Semantic Versioning is valid when provided as such:
```
<valid semver> ::= <version core>
                 | <version core> "-" <pre-release>
                 | <version core> "+" <build>
                 | <version core> "-" <pre-release> "+" <build>
<version core> ::= <major> "." <minor> "." <patch>
```
## Conclusion
While semantic versioning is very useful, it can have it's flaws. It doesn't always capture everything important in the version number itself, such as the date the version was rolled out or the commit ID the version represents (although these can be provided as part the build metadata provided at the end of the version number, they are generally not included). And it always isn't completely understood correctly; for example, the developers for Minecraft changed what the `Minor` and the `Patch` mean years after it had already been established what the version should mean for the players (More details can be found under "Further Reading").

Ultimately, you choose whether you want to use semantic versioning or not. Even then, you don't have to strictly follow all the rules outlined by https://semver.org/ if you do choose to use semantic versioning. It never is strictly enforced, although tools like npm benefit greatly if you do strictly adhere to SemVer.

It is up to you as a developer what you plan to do to convey to your end users the change in your software. Semantic versioning is just one of many alternatives that you can use to do so.
## Further Reading
The following are some resources that I found useful in helping me understand semantic versioning as well as the pros and cons of using it.

> [!IMPORTANT]
> **Disclaimer** regarding some of the language present in some of the videos, but it doesn't get too bad.
- https://semver.org/
- https://docs.npmjs.com/about-semantic-versioning
- ["It's time to fix semantic versioning" - Youtube Video](https://www.youtube.com/watch?v=5TIDnT9LTFc)
- ["Why Minecraft's Versioning Sucks (and how to fix it)" - Youtube Video](https://www.youtube.com/watch?v=fELjfbLmgus)