import User from "types/User"
import { addGravatarInfo } from "utils/gravatar";

describe("gravatar", () => {
    let currentUser: User;

    beforeEach(() => {
        currentUser = new User(
            "1",
            "",
            false,
            false,
            "",
            false,
            "",
            "",
            "",
            null,
            "",
            []
        );
    });

    it("gravatar are ingnored for users without emails", () => {
        addGravatarInfo(currentUser);
        expect(currentUser.profileURL).toEqual("");
    })

    it("photo url is ignore if already present", () => {
        currentUser.email = "fake@fake.com"
        currentUser.profileURL = "some url"
        addGravatarInfo(currentUser);
        expect(currentUser.profileURL).toEqual("some url");
    })

    it("photo url populated if empty", () => {
        const appendSpy = jest.spyOn(document.head, 'append');
        appendSpy.mockImplementation((args) => {
            window.userFromGravatar({
                entry: [{
                    aboutMe: "Something",
                    profileUrl: "Some url"
                }]
            })
        })

        currentUser.email = "fake@fake.com"
        currentUser.profileURL = ""
        addGravatarInfo(currentUser);
        expect(currentUser.profileURL.length).toBeGreaterThan(1);

        appendSpy.mockRestore()
    })

})