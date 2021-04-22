import md5 from "md5";
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
            null,
            []
        );
    });

    it("gravatar are ignored for users without emails", () => {
        addGravatarInfo(currentUser);
        expect(currentUser.profileURL).toEqual("");
    })

    it("photo url is ignore if already present", () => {
        currentUser.email = "fake@fake.com"
        currentUser.photoURL = "some url"
        addGravatarInfo(currentUser);
        expect(currentUser.photoURL).toEqual("some url");
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
        currentUser.photoURL = ""
        addGravatarInfo(currentUser);
        const expectedUrl = "https://www.gravatar.com/avatar/" + md5(currentUser.email)
        expect(currentUser.photoURL).toEqual(expectedUrl);

        appendSpy.mockRestore()
    })

})
